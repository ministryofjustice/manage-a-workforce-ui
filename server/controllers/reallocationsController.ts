import { Request, Response } from 'express'
import { ConfirmReallocationForm, ReallocationCaseSummaryForm } from 'forms'
import AllocationsService from '../services/allocationsService'
import FeatureFlagService from '../services/featureFlagService'
import ProbationEstateService from '../services/probationEstateService'
import UserPreferenceService from '../services/userPreferenceService'
import WorkloadService from '../services/workloadService'
import { unescapeApostrophe } from '../utils/utils'
import AllocatedCase from '../models/AllocatedCase'
import DisplayAddress from './data/DisplayAddress'
import Conviction from '../models/Conviction'
import Sentence from './data/Sentence'
import DocumentRow from './data/DocumentRow'
import {
  getChoosePractitionerDataAllTeams,
  getChoosePractitionerDataByTeam,
  getStaffCodes,
  setStaffRestrictions,
} from './allocationsController'
import trimForm from '../utils/trim'
import validate from '../validation/validation'

export default class ReallocationsController {
  constructor(
    private readonly allocationsService: AllocationsService,
    private readonly workloadService: WorkloadService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly probationEstateService: ProbationEstateService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async getSearch(req, res, pduCode: string) {
    const reallocationEnabledFlag = await this.featureFlagService.isFeatureEnabled('Reallocations', 'Reallocations')

    if (!reallocationEnabledFlag) {
      res.redirect(`/pdu/${pduCode}/teams`)
      return
    }

    const { search } = req.query
    const { token, username } = res.locals.user
    const [teamsUserPreference, probationDeliveryUnitDetails] = await Promise.all([
      this.userPreferenceService.getTeamsUserPreference(token, username),
      this.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode),
    ])

    let searchData
    let error: boolean = false

    if (search) {
      try {
        searchData = await this.allocationsService.getCrnForReallocation(search.toUpperCase(), token)
      } catch {
        error = true
      }
    }

    const teamCodes = teamsUserPreference.items
    let caseInformationByTeam = []
    if (teamCodes.length) {
      const [workloadByTeam, probationEstateTeams] = await Promise.all([
        this.workloadService.getWorkloadByTeams(token, teamCodes),
        this.probationEstateService.getTeamsByCode(token, teamCodes),
      ])
      caseInformationByTeam = probationEstateTeams
        .map(team => {
          const teamWorkload = workloadByTeam.find(w => w.teamCode === team.code) ?? {
            totalCases: '-',
            workload: '-',
          }

          return {
            teamCode: team.code,
            teamName: team.name,
            workload: `${teamWorkload.workload}%`,
            caseCount: teamWorkload.totalCases,
          }
        })
        .sort((a, b) => a.teamName.localeCompare(b.teamName))
    }

    res.render('pages/reallocations/search', {
      search,
      searchData,
      pduCode,
      teams: caseInformationByTeam,
      pduName: probationDeliveryUnitDetails.name,
      regionName: probationDeliveryUnitDetails.region.name,
      error,
      title: 'Reallocations | Manage a Workforce',
      journey: 'reallocations',
    })
  }

  async getAllocatedCase(req: Request, res: Response, crn, pduCode): Promise<void> {
    const reallocationEnabledFlag = await this.featureFlagService.isFeatureEnabled('Reallocations', 'Reallocations')

    if (!reallocationEnabledFlag) {
      res.redirect(`/pdu/${pduCode}/teams`)
      return
    }

    const [response, risk, assessmentDate] = await Promise.all([
      await this.allocationsService.getAllocatedCase(res.locals.user.token, crn),
      await this.allocationsService.getCaseRisk(res.locals.user.token, crn),
      await this.allocationsService.getAssessmentDate(res.locals.user.token, crn),
    ])

    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getCrnAccess(res.locals.user.token, res.locals.user.username, crn)
    const address = new DisplayAddress(response.address)
    response.name = unescapeApostrophe(response.name)

    const { instructions: cachedInstructions } = await this.allocationsService.getCrnOnlyNotesCache(
      crn,
      res.locals.user.username,
    )

    if (risk.roshRisk) {
      risk.roshLevel = risk.roshRisk.overallRisk
    }

    if (risk.rsr) {
      risk.rsrLevel = risk.rsr.level
    }

    if (risk.ogrs) {
      risk.ogrsScore = risk.ogrs.score
    }

    const formData = req.session.caseSummaryForm || {}
    req.session.caseSummaryForm = null

    const instructions = formData.reallocationNotes || cachedInstructions || ''
    const reason = formData.reason || ''

    res.render('pages/reallocation-summary', {
      data: response,
      assessment: assessmentDate,
      risk,
      address,
      crn: response.crn,
      tier: response.tier,
      name: response.name,
      title: 'Reallocation | Manage a Workforce',
      pduCode,
      outOfAreaTransfer: response.outOfAreaTransfer,
      laoCase,
      errors: req.flash('errors') || [],
      instructions,
      reason,
    })
  }

  async getAllocatedPersonalDetails(req: Request, res: Response, crn, pduCode): Promise<void> {
    const reallocationEnabledFlag = await this.featureFlagService.isFeatureEnabled('Reallocations', 'Reallocations')

    if (!reallocationEnabledFlag) {
      res.redirect(`/pdu/${pduCode}/teams`)
      return
    }

    const response: AllocatedCase = await this.allocationsService.getAllocatedCase(res.locals.user.token, crn)
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getCrnAccess(res.locals.user.token, res.locals.user.username, crn)
    const address = new DisplayAddress(response.address)
    response.name = unescapeApostrophe(response.name)
    const { instructions } = await this.allocationsService.getCrnOnlyNotesCache(crn, res.locals.user.username)

    res.render('pages/personal-details', {
      data: response,
      address,
      crn: response.crn,
      tier: response.tier,
      name: response.name,
      title: 'Personal details | Manage a Workforce',
      pduCode,
      outOfAreaTransfer: response.outOfAreaTransfer,
      laoCase,
      errors: req.flash('errors') || [],
      instructions,
    })
  }

  async getAllocatedProbationRecord(req: Request, res: Response, crn, pduCode): Promise<void> {
    const reallocationEnabledFlag = await this.featureFlagService.isFeatureEnabled('Reallocations', 'Reallocations')

    if (!reallocationEnabledFlag) {
      res.redirect(`/pdu/${pduCode}/teams`)
      return
    }

    const allocatedCase = await this.allocationsService.getAllocatedCase(res.locals.user.token, crn)
    const convictionNumber = allocatedCase.activeEvents.reverse()[0].number

    const probationRecord = await this.allocationsService.getAllocatedProbationRecord(
      res.locals.user.token,
      crn,
      convictionNumber,
    )
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getCrnAccess(res.locals.user.token, res.locals.user.username, crn)

    const totalPreviousCount = probationRecord.previous.length
    const viewAll = totalPreviousCount <= 3 ? true : req.query.viewAll
    const amountToSlice = viewAll ? totalPreviousCount : 3
    const currentSentences = probationRecord.active
      .sort((a: Conviction, b: Conviction) => Date.parse(b.startDate) - Date.parse(a.startDate))
      .map(
        activeRecord =>
          new Sentence(
            activeRecord.description,
            activeRecord.length,
            activeRecord.offences,
            activeRecord.startDate,
            activeRecord.offenderManager,
          ),
      )
    const previousSentences = probationRecord.previous
      .sort((a: Conviction, b: Conviction) => Date.parse(b.endDate) - Date.parse(a.endDate))
      .map(
        activeRecord =>
          new Sentence(
            activeRecord.description,
            activeRecord.length,
            activeRecord.offences,
            activeRecord.endDate,
            activeRecord.offenderManager,
          ),
      )
      .slice(0, amountToSlice)
    probationRecord.name = unescapeApostrophe(probationRecord.name)
    const { instructions } = await this.allocationsService.getCrnOnlyNotesCache(crn, res.locals.user.username)
    res.render('pages/reallocation-probation-record', {
      name: probationRecord.name,
      crn: probationRecord.crn,
      tier: probationRecord.tier,
      currentSentences,
      previousSentences,
      viewAll,
      totalPreviousCount,
      title: 'Probation record | Manage a workforce',
      pduCode,
      outOfAreaTransfer: allocatedCase.outOfAreaTransfer,
      laoCase,
      errors: req.flash('errors') || [],
      instructions,
    })
  }

  async getAllocatedRisk(req: Request, res: Response, crn: string, pduCode: string) {
    const reallocationEnabledFlag = await this.featureFlagService.isFeatureEnabled('Reallocations', 'Reallocations')

    if (!reallocationEnabledFlag) {
      res.redirect(`/pdu/${pduCode}/teams`)
      return
    }

    const [allocatedCase, risk] = await Promise.all([
      await this.allocationsService.getAllocatedCase(res.locals.user.token, crn),
      await this.allocationsService.getCaseRisk(res.locals.user.token, crn),
    ])
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getCrnAccess(res.locals.user.token, res.locals.user.username, crn)

    risk.name = unescapeApostrophe(risk.name)
    const { instructions } = await this.allocationsService.getCrnOnlyNotesCache(crn, res.locals.user.username)

    res.render('pages/reallocation-risk', {
      title: 'Risk | Manage a workforce',
      data: risk,
      crn: risk.crn,
      tier: risk.tier,
      name: risk.name,
      pduCode,
      outOfAreaTransfer: allocatedCase.outOfAreaTransfer,
      laoCase,
      errors: req.flash('errors') || [],
      instructions,
    })
  }

  async getAllocatedDocuments(req: Request, res: Response, crn: string, pduCode: string) {
    const reallocationEnabledFlag = await this.featureFlagService.isFeatureEnabled('Reallocations', 'Reallocations')

    if (!reallocationEnabledFlag) {
      res.redirect(`/pdu/${pduCode}/teams`)
      return
    }

    const [allocatedCase, documents] = await Promise.all([
      await this.allocationsService.getAllocatedCase(res.locals.user.token, crn),
      await this.allocationsService.getDocuments(res.locals.user.token, crn),
    ])
    const documentRows = documents.map(document => new DocumentRow(document))
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getCrnAccess(res.locals.user.token, res.locals.user.username, crn)
    allocatedCase.name = unescapeApostrophe(allocatedCase.name)
    const { instructions } = await this.allocationsService.getCrnOnlyNotesCache(crn, res.locals.user.username)
    res.render('pages/reallocation-documents', {
      title: 'Documents | Manage a workforce',
      crn: allocatedCase.crn,
      tier: allocatedCase.tier,
      name: allocatedCase.name,
      pduCode,
      documents: documentRows,
      documentsCount: documentRows.length,
      outOfAreaTransfer: allocatedCase.outOfAreaTransfer,
      laoCase,
      errors: req.flash('errors') || [],
      instructions,
    })
  }

  async getPractitioners(req: Request, res: Response, crn: string, pduCode: string) {
    const { token, username } = res.locals.user
    const teamCodesPreferences = await this.userPreferenceService.getTeamsUserPreference(token, username)
    const laoCase = await this.allocationsService.getLaoStatus(crn, token)
    await this.allocationsService.getCrnAccess(res.locals.user.token, res.locals.user.username, crn)
    const [allocationInformationByTeam, allTeamDetails] = await Promise.all([
      await this.workloadService.getChoosePractitionerData(token, crn, teamCodesPreferences.items),
      await this.probationEstateService.getTeamsByCode(token, teamCodesPreferences.items),
    ])

    if (laoCase === true) {
      // get the LAO status of each staffCode and add to allocation Information
      const staffRestrictions = await this.allocationsService.getRestrictedStatusByCrnAndStaffCodes(
        token,
        crn,
        getStaffCodes(allocationInformationByTeam.teams),
      )
      allocationInformationByTeam.teams = setStaffRestrictions(allocationInformationByTeam.teams, staffRestrictions)
    }

    const offenderManagersToAllocateByTeam = getChoosePractitionerDataByTeam(
      allocationInformationByTeam,
      allTeamDetails,
    )
    const offenderManagersToAllocateAllTeams = getChoosePractitionerDataAllTeams(offenderManagersToAllocateByTeam)
    const offenderManagersToAllocatePerTeam = [offenderManagersToAllocateAllTeams, ...offenderManagersToAllocateByTeam]

    const name = `${allocationInformationByTeam.name.forename} ${allocationInformationByTeam.name.surname}`
    const offenderManager = allocationInformationByTeam.communityPersonManager && {
      code: allocationInformationByTeam.communityPersonManager.code,
      forenames: allocationInformationByTeam.communityPersonManager.name.forename,
      surname: allocationInformationByTeam.communityPersonManager.name.surname,
      grade: allocationInformationByTeam.communityPersonManager.grade,
    }

    const missingEmail = offenderManagersToAllocateAllTeams.offenderManagersToAllocate.some(i => !i.email)
    const error = req.query.error === 'true'

    res.render('pages/reallocations/choose-practitioner', {
      crn: allocationInformationByTeam.crn,
      tier: allocationInformationByTeam.tier,
      pduCode,
      errors: [],
      title: 'Reallocations | Manage a Workforce',
      journey: 'reallocations',
      offenderManagersToAllocatePerTeam,
      name,
      currentOffenderManager: offenderManager,
      missingEmail,
      error,
      laoCase,
    })
  }

  async allocateToPractitioner(req: Request, res: Response, crn: string, pduCode: string) {
    res.redirect(`/pdu/${pduCode}/${crn}/reallocations/confirm-reallocation`)
  }

  async submitCaseSummary(req: Request, res: Response, pduCode: string, crn: string, form) {
    const caseSummaryForm = trimForm<ReallocationCaseSummaryForm>(form)
    const errors = validate(
      caseSummaryForm,
      { reallocationNotes: 'nourl', reason: 'required' },
      {
        nourl: 'You cannot include links in the allocation notes',
        'required.reason': 'Select a reallocation reason',
      },
    )

    if (errors.length > 0) {
      req.session.caseSummaryForm = caseSummaryForm
      req.flash('errors', errors)
      return res.redirect(`/pdu/${pduCode}/${crn}/reallocation-case-view`)
    }

    return res.redirect(`/pdu/${pduCode}/${crn}/reallocations/choose-practitioner`)
  }

  async reviewReallocationPractitioner() {
    // TODO get team and code and practitioner code from form or maybe it is passed
    // TODO call page to display all details and allow submit
  }

  async submitCaseReallocation(req: Request, res: Response, crn, staffTeamCode, staffCode, form, pduCode) {
    const confirmReallocationForm = trimForm<ConfirmReallocationForm>(form)

    // get information from form
    const { emailPreviousOfficer } = confirmReallocationForm
    const otherEmails = confirmReallocationForm.person?.map(p => p.email).filter(email => email)
    const { reallocationNotes } = confirmReallocationForm
    const sensitiveNotes = confirmReallocationForm.isSensitive
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    const { previousStaffCode } = confirmReallocationForm
    const allocationReason = confirmReallocationForm.reasonCode
    const { nextAppointmentDate } = confirmReallocationForm
    const { lastOasysAssessmentDate } = confirmReallocationForm
    const { failureToComply } = confirmReallocationForm

    await this.allocationsService.getCrnAccess(res.locals.user.token, res.locals.user.username, crn)

    await this.workloadService.reallocateCaseToOffenderManager(
      res.locals.user.token,
      crn,
      previousStaffCode,
      emailPreviousOfficer,
      staffCode,
      staffTeamCode,
      otherEmails,
      reallocationNotes,
      sensitiveNotes,
      laoCase,
      allocationReason,
      nextAppointmentDate,
      lastOasysAssessmentDate,
      failureToComply,
    )

    this.allocationsService.setCrnOnlyNotesCache(crn, res.locals.user.username, {
      instructions: reallocationNotes,
    })

    return res.redirect(`/pdu/${pduCode}/${crn}/reallocations/reallocation-complete`)
  }

  async reallocationComplete(req: Request, res: Response, crn: string, pduCode: string) {
    res.render('pages/reallocations/reallocation-complete', {
      crn,
      pduCode,
    })
  }
}
