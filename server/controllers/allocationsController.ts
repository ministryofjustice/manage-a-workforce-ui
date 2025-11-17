import { Request, Response } from 'express'
import type { ConfirmInstructionForm } from 'forms'
import AllocationsService from '../services/allocationsService'
import Allocation from '../models/Allocation'
import Sentence from './data/Sentence'
import Conviction from '../models/Conviction'
import { gradeOrder, gradeTips } from './data/AllocateOffenderManager'
import OffenderManagerPotentialWorkload from '../models/OffenderManagerPotentialWorkload'
import FileDownload from '../models/FileDownload'
import WorkloadService from '../services/workloadService'
import Case from './data/Case'
import validate from '../validation/validation'
import trimForm from '../utils/trim'
import OfficerView from './data/OfficerView'
import DisplayAddress from './data/DisplayAddress'
import ProbationEstateService from '../services/probationEstateService'
import DocumentRow from './data/DocumentRow'
import ChoosePractitionerData, { Practitioner } from '../models/ChoosePractitionerData'
import UserPreferenceService from '../services/userPreferenceService'
import { TeamAndStaffCode } from '../utils/teamAndStaffCode'
import PersonOnProbationStaffDetails from '../models/PersonOnProbationStaffDetails'
import EstateTeam from '../models/EstateTeam'
import { unescapeApostrophe } from '../utils/utils'
import CrnStaffRestrictions from '../models/CrnStaffRestrictions'
import FeatureFlagService from '../services/featureFlagService'
import CrnDetails from '../models/ReallocationCrnDetails'
import AllocatedCase from '../models/AllocatedCase'

export default class AllocationsController {
  constructor(
    private readonly allocationsService: AllocationsService,
    private readonly workloadService: WorkloadService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly probationEstateService: ProbationEstateService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async getUnallocatedCase(req: Request, res: Response, crn, convictionNumber, pduCode): Promise<void> {
    const response: Allocation = await this.allocationsService.getUnallocatedCase(
      res.locals.user.token,
      crn,
      convictionNumber,
    )
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getUserRegionAccessForCrn(
      res.locals.user.token,
      res.locals.user.username,
      crn,
      convictionNumber,
    )
    const address = new DisplayAddress(response.address)
    response.name = unescapeApostrophe(response.name)
    const { instructions } = await this.allocationsService.getNotesCache(
      crn,
      convictionNumber,
      res.locals.user.username,
    )
    res.render('pages/summary', {
      data: response,
      address,
      crn: response.crn,
      tier: response.tier,
      name: response.name,
      convictionNumber: response.convictionNumber,
      title: 'Case summary | Manage a Workforce',
      pduCode,
      outOfAreaTransfer: response.outOfAreaTransfer,
      laoCase,
      errors: req.flash('errors') || [],
      instructions,
    })
  }

  async getAllocatedCase(req: Request, res: Response, crn, pduCode): Promise<void> {
    const response: AllocatedCase = await this.allocationsService.getAllocatedCase(res.locals.user.token, crn)
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getCrnAccess(res.locals.user.token, res.locals.user.username, crn)
    const address = new DisplayAddress(response.address)
    response.name = unescapeApostrophe(response.name)

    const { instructions } = await this.allocationsService.getCrnOnlyNotesCache(crn, res.locals.user.username)

    res.render('pages/reallocation-summary', {
      data: response,
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
    })
  }

  async getAllocatedPersonalDetails(req: Request, res: Response, crn, pduCode): Promise<void> {
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

  async lookupCrnDetailsForAllocations(req: Request, res: Response, crn: string, staffCode: string, pduCode: string) {
    const response: CrnDetails[] = await this.allocationsService.getLookupforCrn(crn, res.locals.user.token)
    res.render('pages/find-person-to-reallocate', {
      title: 'Find person to reallocate | Manage a Workforce',
      crn,
      staffCode,
      pduCode,
      data: {
        name: response.length > 0 ? `${response[0].name.forename} ${response[0].name.surname}` : '',
        dob: response.length > 0 ? response[0].dateOfBirth : '',
        manager: response.length > 0 ? `${response[0].manager.name.forename} ${response[0].manager.name.surname}` : '',
        hasActiveOrder: response.length > 0 ? response[0].hasActiveOrder : false,
      },
    })
  }

  async getProbationRecord(req: Request, res: Response, crn, convictionNumber, pduCode): Promise<void> {
    const [unallocatedCase, probationRecord] = await Promise.all([
      await this.allocationsService.getUnallocatedCase(res.locals.user.token, crn, convictionNumber),
      await this.allocationsService.getProbationRecord(res.locals.user.token, crn, convictionNumber),
    ])
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getUserRegionAccessForCrn(
      res.locals.user.token,
      res.locals.user.username,
      crn,
      convictionNumber,
    )

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
    const { instructions } = await this.allocationsService.getNotesCache(
      crn,
      convictionNumber,
      res.locals.user.username,
    )
    res.render('pages/probation-record', {
      name: probationRecord.name,
      crn: probationRecord.crn,
      tier: probationRecord.tier,
      currentSentences,
      previousSentences,
      viewAll,
      totalPreviousCount,
      convictionNumber: probationRecord.convictionNumber,
      title: 'Probation record | Manage a workforce',
      pduCode,
      outOfAreaTransfer: unallocatedCase.outOfAreaTransfer,
      laoCase,
      errors: req.flash('errors') || [],
      instructions,
    })
  }

  async getAllocatedProbationRecord(req: Request, res: Response, crn, pduCode): Promise<void> {
    const allocatedCase = await this.allocationsService.getAllocatedCase(res.locals.user.token, crn)
    const convictionNumber = allocatedCase.activeEvents.reverse()[0].number

    const probationRecord = await this.allocationsService.getProbationRecord(res.locals.user.token, crn, 1)
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

  async getRisk(req: Request, res: Response, crn: string, convictionNumber, pduCode: string) {
    const [unallocatedCase, risk] = await Promise.all([
      await this.allocationsService.getUnallocatedCase(res.locals.user.token, crn, convictionNumber),
      await this.allocationsService.getRisk(res.locals.user.token, crn, convictionNumber),
    ])
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getUserRegionAccessForCrn(
      res.locals.user.token,
      res.locals.user.username,
      crn,
      convictionNumber,
    )

    risk.name = unescapeApostrophe(risk.name)
    const { instructions } = await this.allocationsService.getNotesCache(
      crn,
      convictionNumber,
      res.locals.user.username,
    )
    res.render('pages/risk', {
      title: 'Risk | Manage a workforce',
      data: risk,
      crn: risk.crn,
      tier: risk.tier,
      name: risk.name,
      convictionNumber: risk.convictionNumber,
      pduCode,
      outOfAreaTransfer: unallocatedCase.outOfAreaTransfer,
      laoCase,
      errors: req.flash('errors') || [],
      instructions,
    })
  }

  async getAllocatedRisk(req: Request, res: Response, crn: string, pduCode: string) {
    const [allocatedCase, risk] = await Promise.all([
      await this.allocationsService.getAllocatedCase(res.locals.user.token, crn),
      await this.allocationsService.getRisk(res.locals.user.token, crn, 1),
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

  async getDocuments(req: Request, res: Response, crn: string, convictionNumber, pduCode: string) {
    const [unallocatedCase, caseOverview, documents] = await Promise.all([
      await this.allocationsService.getUnallocatedCase(res.locals.user.token, crn, convictionNumber),
      await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionNumber),
      await this.allocationsService.getDocuments(res.locals.user.token, crn),
    ])
    const documentRows = documents.map(document => new DocumentRow(document))
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getUserRegionAccessForCrn(
      res.locals.user.token,
      res.locals.user.username,
      crn,
      convictionNumber,
    )
    caseOverview.name = unescapeApostrophe(caseOverview.name)
    const { instructions } = await this.allocationsService.getNotesCache(
      crn,
      convictionNumber,
      res.locals.user.username,
    )
    res.render('pages/documents', {
      title: 'Documents | Manage a workforce',
      crn: caseOverview.crn,
      tier: caseOverview.tier,
      name: caseOverview.name,
      convictionNumber: caseOverview.convictionNumber,
      pduCode,
      documents: documentRows,
      documentsCount: documentRows.length,
      outOfAreaTransfer: unallocatedCase.outOfAreaTransfer,
      laoCase,
      errors: req.flash('errors') || [],
      instructions,
    })
  }

  async getAllocatedDocuments(req: Request, res: Response, crn: string, pduCode: string) {
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

  async choosePractitioner(req: Request, res: Response, crn, convictionNumber, pduCode) {
    const { token, username } = res.locals.user

    const teamCodesPreferences = await this.userPreferenceService.getTeamsUserPreference(token, username)
    const laoCase = await this.allocationsService.getLaoStatus(crn, token)
    await this.allocationsService.getUserRegionAccessForCrn(
      res.locals.user.token,
      res.locals.user.username,
      crn,
      convictionNumber,
    )
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
    const offenderManagersToAllocatePerTeam = [offenderManagersToAllocateAllTeams].concat(
      offenderManagersToAllocateByTeam,
    )

    const name = `${allocationInformationByTeam.name.forename} ${allocationInformationByTeam.name.surname}`
    const offenderManager = allocationInformationByTeam.communityPersonManager && {
      forenames: allocationInformationByTeam.communityPersonManager.name.forename,
      surname: allocationInformationByTeam.communityPersonManager.name.surname,
      grade: allocationInformationByTeam.communityPersonManager.grade,
    }
    const missingEmail = offenderManagersToAllocateAllTeams.offenderManagersToAllocate.some(i => !i.email)
    const error = req.query.error === 'true'
    const { instructions } = await this.allocationsService.getNotesCache(
      crn,
      convictionNumber,
      res.locals.user.username,
    )
    return res.render('pages/choose-practitioner', {
      title: 'Choose practitioner | Manage a workforce',
      name,
      crn: allocationInformationByTeam.crn,
      tier: allocationInformationByTeam.tier,
      convictionNumber,
      probationStatus: allocationInformationByTeam.probationStatus.description,
      offenderManager,
      offenderManagersToAllocatePerTeam,
      error,
      missingEmail,
      pduCode,
      laoCase,
      instructions,
      errors: req.flash('errors') || [],
    })
  }

  async selectAllocateOffenderManager(req: Request, res: Response, crn, convictionNumber, pduCode) {
    const {
      body: { allocatedOfficer: teamAndStaffCode },
    } = req
    if (teamAndStaffCode) {
      const { teamCode: chosenStaffTeamCode, staffCode } = TeamAndStaffCode.decode(teamAndStaffCode)
      return res.redirect(
        `/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocate/${chosenStaffTeamCode}/${staffCode}/allocate-to-practitioner`,
      )
    }
    req.query.error = 'true'
    return this.choosePractitioner(req, res, crn, convictionNumber, pduCode)
  }

  async getAllocateToPractitioner(
    req: Request,
    res: Response,
    crn,
    staffTeamCode,
    staffCode,
    convictionNumber,
    pduCode,
  ) {
    const response: OffenderManagerPotentialWorkload = await this.workloadService.getCaseAllocationImpact(
      res.locals.user.token,
      crn,
      staffCode,
      staffTeamCode,
    )
    const laoCase = await this.allocationsService.getLaoStatus(crn, req.user.token)
    await this.allocationsService.getUserRegionAccessForCrn(
      res.locals.user.token,
      res.locals.user.username,
      crn,
      convictionNumber,
    )
    response.name.combinedName = unescapeApostrophe(response.name.combinedName)
    response.name.surname = unescapeApostrophe(response.name.surname)
    const { instructions } = await this.allocationsService.getNotesCache(
      crn,
      convictionNumber,
      res.locals.user.username,
    )
    res.render('pages/allocate-to-practitioner', {
      title: 'Allocate to practitioner | Manage a workforce',
      data: response,
      name: response.name.combinedName,
      crn,
      tier: response.tier,
      convictionNumber,
      staffCode,
      staffTeamCode,
      pduCode,
      laoCase,
      instructions,
      errors: req.flash('errors') || [],
    })
  }

  async getConfirmInstructions(
    req: Request,
    res: Response,
    crn,
    staffTeamCode,
    staffCode,
    convictionNumber,
    pduCode,
    scrollToBottom = false,
  ) {
    const response: PersonOnProbationStaffDetails = await this.allocationsService.getConfirmInstructions(
      res.locals.user.token,
      crn,
      convictionNumber,
      staffCode,
    )
    const laoCase = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getUserRegionAccessForCrn(
      res.locals.user.token,
      res.locals.user.username,
      crn,
      convictionNumber,
    )
    response.name.surname = unescapeApostrophe(response.name.surname)
    response.name.combinedName = unescapeApostrophe(response.name.combinedName)

    const { instructions, person, isSensitive, emailCopyOptOut } = await this.allocationsService.getNotesCache(
      crn,
      convictionNumber,
      res.locals.user.username,
    )
    res.render('pages/confirm-instructions', {
      title: 'Review allocation notes | Manage a workforce',
      data: response,
      name: response.name.combinedName,
      crn: response.crn,
      tier: response.tier,
      staffCode,
      staffTeamCode,
      convictionNumber: response.convictionNumber,
      errors: req.flash('errors') || [],
      pduCode,
      scrollToBottom,
      laoCase,
      instructions,
      person,
      isSensitive,
      emailCopyOptOut,
    })
  }

  async getCheckEdit(
    req: Request,
    res: Response,
    crn,
    staffTeamCode,
    staffCode,
    convictionNumber,
    pduCode,
    scrollToBottom = false,
  ) {
    const response: PersonOnProbationStaffDetails = await this.allocationsService.getConfirmInstructions(
      res.locals.user.token,
      crn,
      convictionNumber,
      staffCode,
    )
    const laoCase = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getUserRegionAccessForCrn(
      res.locals.user.token,
      res.locals.user.username,
      crn,
      convictionNumber,
    )
    response.name.surname = unescapeApostrophe(response.name.surname)
    response.name.combinedName = unescapeApostrophe(response.name.combinedName)
    const { instructions } = await this.allocationsService.getNotesCache(
      crn,
      convictionNumber,
      res.locals.user.username,
    )
    res.render('pages/check-edit-allocation-notes', {
      crn,
      staffCode,
      staffTeamCode,
      convictionNumber,
      pduCode,
      title: 'Edit or save allocation notes | Manage a Workforce',
      tier: response.tier,
      name: response.name.combinedName,
      data: response,
      scrollToBottom,
      laoCase,
      instructions,
    })
  }

  async getOverview(
    _,
    res: Response,
    offenderManagerTeamCode,
    offenderManagerCode,
    convictionNumber,
    pduCode,
    history,
  ) {
    const [response, teamDetails] = await Promise.all([
      this.workloadService.getOffenderManagerOverview(
        res.locals.user.token,
        offenderManagerCode,
        offenderManagerTeamCode,
      ),
      this.probationEstateService.getTeamDetails(res.locals.user.token, offenderManagerTeamCode),
    ])
    const data: OfficerView = new OfficerView(response)
    let nextPage = 'pages/officer-overview'
    if (history) {
      nextPage = 'pages/history-officer-overview'
    }

    res.render(nextPage, {
      title: 'Practitioner workload | Manage a Workforce',
      data,
      officerTeamCode: offenderManagerTeamCode,
      convictionNumber,
      isOverview: true,
      pduCode,
      teamName: teamDetails.name,
    })
  }

  async getActiveCases(_, res: Response, offenderManagerTeamCode, offenderManagerCode, convictionNumber, pduCode) {
    const [response, teamDetails] = await Promise.all([
      this.workloadService.getOffenderManagerCases(res.locals.user.token, offenderManagerCode, offenderManagerTeamCode),
      this.probationEstateService.getTeamDetails(res.locals.user.token, offenderManagerTeamCode),
    ])

    const caseList = response.activeCases.map(activeCase => activeCase.crn)

    let restrictedList: string[] = []
    let excludedList: string[] = []

    if (caseList.length > 0) {
      const crnRestrictions = await this.allocationsService.getRestrictedStatusByCrns(res.locals.user.token, caseList)
      restrictedList = crnRestrictions.access
        .filter(restriction => restriction.userRestricted)
        .map(restriction => restriction.crn)

      excludedList = crnRestrictions.access
        .filter(restriction => restriction.userExcluded)
        .map(restrictions => restrictions.crn)
    }

    const cases = response.activeCases.map(
      activeCase =>
        new Case(
          activeCase.crn,
          activeCase.tier,
          activeCase.type,
          activeCase.name.combinedName,
          excludedList.includes(activeCase.crn),
          restrictedList.includes(activeCase.crn),
        ),
    )
    response.name.surname = unescapeApostrophe(response.name.surname)
    response.name.combinedName = unescapeApostrophe(response.name.combinedName)
    res.render('pages/active-cases', {
      title: 'Active cases | Manage a workforce',
      data: response,
      officerTeamCode: offenderManagerTeamCode,
      cases,
      convictionNumber,
      isActiveCases: true,
      pduCode,
      teamName: teamDetails.name,
    })
  }

  async getCasesForReallocation(_, res: Response, offenderManagerTeamCode, offenderManagerCode, pduCode) {
    const reallocationEnabledFlag = await this.featureFlagService.isFeatureEnabled('Reallocations', 'Reallocations')

    if (!reallocationEnabledFlag) {
      res.redirect(`/pdu/${pduCode}/teams`)
      return
    }

    const [response, teamDetails, casesOverview] = await Promise.all([
      this.workloadService.getOffenderManagerCases(res.locals.user.token, offenderManagerCode, offenderManagerTeamCode),
      this.probationEstateService.getTeamDetails(res.locals.user.token, offenderManagerTeamCode),
      this.workloadService.getOffenderManagerOverview(
        res.locals.user.token,
        offenderManagerCode,
        offenderManagerTeamCode,
      ),
    ])

    const data: OfficerView = new OfficerView(casesOverview)

    const caseList = response.activeCases.map(activeCase => activeCase.crn)

    let restrictedList: string[] = []
    let excludedList: string[] = []

    if (caseList.length > 0) {
      const crnRestrictions = await this.allocationsService.getRestrictedStatusByCrns(res.locals.user.token, caseList)
      restrictedList = crnRestrictions.access
        .filter(restriction => restriction.userRestricted)
        .map(restriction => restriction.crn)

      excludedList = crnRestrictions.access
        .filter(restriction => restriction.userExcluded)
        .map(restrictions => restrictions.crn)
    }

    const cases = response.activeCases.map(
      activeCase =>
        new Case(
          activeCase.crn,
          activeCase.tier,
          activeCase.type,
          activeCase.name.combinedName,
          excludedList.includes(activeCase.crn),
          restrictedList.includes(activeCase.crn),
          activeCase.initialAllocationDate,
        ),
    )
    response.name.surname = unescapeApostrophe(response.name.surname)
    response.name.combinedName = unescapeApostrophe(response.name.combinedName)
    res.render('pages/reallocation-active-cases', {
      title: 'Active cases | Manage a workforce',
      data: response,
      overviewData: data,
      officerTeamCode: offenderManagerTeamCode,
      cases,
      isActiveCases: true,
      pduCode,
      teamName: teamDetails.name,
    })
  }

  async getDocument(res: Response, crn, documentId, documentName) {
    const response: FileDownload = await this.allocationsService.getDocument(res.locals.user.token, crn, documentId)
    res.attachment(documentName)
    response.data.pipe(res)
  }

  async allocateCaseToOffenderManager(
    req: Request,
    res: Response,
    crn,
    staffTeamCode,
    staffCode,
    convictionNumber,
    form,
    pduCode,
  ) {
    const confirmInstructionForm = filterEmptyEmails(
      trimForm<ConfirmInstructionForm>({
        ...form,
        isSensitive: form.isSensitive === 'yes',
        emailCopyOptOut: form.emailCopyOptOut === 'yes',
      }),
    )

    if (form.remove !== undefined) {
      form.person.splice(form.remove, 1)
    }

    this.allocationsService.setNotesCache(crn, convictionNumber, res.locals.user.username, {
      instructions: form.instructions,
      isSensitive: confirmInstructionForm.isSensitive,
      emailCopyOptOut: confirmInstructionForm.emailCopyOptOut,
      person: form.person,
    })

    if (form.action === 'continue') {
      return res.redirect(
        `/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocate/${staffTeamCode}/${staffCode}/spo-oversight-contact-option`,
      )
    }

    return res.redirect(
      `/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocate/${staffTeamCode}/${staffCode}/allocation-notes`,
    )
  }

  async submitSpoOversight(
    req: Request,
    res: Response,
    crn,
    staffTeamCode,
    staffCode,
    convictionNumber: number,
    form,
    pduCode,
  ) {
    const spoOversightForm = trimForm<ConfirmInstructionForm>({ ...form, isSensitive: form.isSensitive === 'yes' })
    // const laoCase = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    const errors = validate(
      spoOversightForm,
      { 'person.*.email': 'email', instructions: 'nourl' },
      {
        email: 'Enter an email address in the correct format, like name@example.com',
        nourl: 'You cannot include links in the allocation notes',
      },
    ).map(error => fixupArrayNotation(error))

    const { instructions, person, isSensitive, emailCopyOptOut } = await this.allocationsService.getNotesCache(
      crn,
      `${convictionNumber}`,
      res.locals.user.username,
    )

    if (!instructions) {
      throw Error('Allocation instructions not set')
    }

    if (errors.length > 0) {
      req.flash('errors', errors)
      return res.redirect(
        `/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocate/${staffCode}/${staffTeamCode}/spo-oversight-contact-option`,
      )
    }

    const sendEmailCopyToAllocatingOfficer = !emailCopyOptOut
    const otherEmails = person?.map(p => p.email).filter(email => email)

    const spoOversightContact = spoOversightForm.instructions
    const spoOversightSensitive = spoOversightForm.isSensitive
    const allocationNotes = instructions
    const allocationNotesSensitive = isSensitive
    const isSPOOversightAccessed = 'true'
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getUserRegionAccessForCrn(
      res.locals.user.token,
      res.locals.user.username,
      crn,
      convictionNumber.toString(),
    )

    await this.workloadService.allocateCaseToOffenderManager(
      res.locals.user.token,
      crn,
      staffCode,
      staffTeamCode,
      otherEmails,
      sendEmailCopyToAllocatingOfficer,
      convictionNumber,
      spoOversightContact,
      spoOversightSensitive,
      allocationNotes,
      allocationNotesSensitive,
      isSPOOversightAccessed,
      laoCase,
    )

    await this.allocationsService.setNotesCache(crn, `${convictionNumber}`, res.locals.user.username, {
      sendEmailCopyToAllocatingOfficer,
      spoOversightContact,
      spoOversightSensitive,
    })

    return res.redirect(`/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocation-complete`)
  }

  async submitNoSpoOversight(
    req: Request,
    res: Response,
    crn,
    staffTeamCode,
    staffCode,
    convictionNumber,
    form,
    pduCode,
  ) {
    const { instructions, person, isSensitive, emailCopyOptOut } = await this.allocationsService.getNotesCache(
      crn,
      `${convictionNumber}`,
      res.locals.user.username,
    )

    if (!instructions) {
      throw Error('Allocation instructions not set')
    }

    const sendEmailCopyToAllocatingOfficer = !emailCopyOptOut
    const otherEmails = person?.map(p => p.email).filter(email => email)
    const spoOversightContact = instructions
    const spoOversightSensitive = isSensitive
    const allocationNotes = instructions
    const allocationNotesSensitive = isSensitive
    const isSPOOversightAccessed = 'false'
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getUserRegionAccessForCrn(
      res.locals.user.token,
      res.locals.user.username,
      crn,
      convictionNumber,
    )

    await this.workloadService.allocateCaseToOffenderManager(
      res.locals.user.token,
      crn,
      staffCode,
      staffTeamCode,
      otherEmails,
      sendEmailCopyToAllocatingOfficer,
      convictionNumber,
      spoOversightContact,
      spoOversightSensitive,
      allocationNotes,
      allocationNotesSensitive,
      isSPOOversightAccessed,
      laoCase,
    )

    await this.allocationsService.setNotesCache(crn, `${convictionNumber}`, res.locals.user.username, {
      sendEmailCopyToAllocatingOfficer,
      spoOversightContact,
      spoOversightSensitive,
    })

    return res.redirect(`/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocation-complete`)
  }

  async getSpoOversight(
    req: Request,
    res: Response,
    crn: string,
    staffTeamCode: string,
    staffCode: string,
    convictionNumber: string,
    pduCode: string,
  ) {
    const response: PersonOnProbationStaffDetails = await this.allocationsService.getConfirmInstructions(
      res.locals.user.token,
      crn,
      convictionNumber,
      staffCode,
    )

    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    await this.allocationsService.getUserRegionAccessForCrn(
      res.locals.user.token,
      res.locals.user.username,
      crn,
      convictionNumber,
    )
    response.name.surname = unescapeApostrophe(response.name.surname)
    response.name.combinedName = unescapeApostrophe(response.name.combinedName)
    const { instructions, person, isSensitive, emailCopyOptOut } = await this.allocationsService.getNotesCache(
      crn,
      `${convictionNumber}`,
      res.locals.user.username,
    )
    res.render('pages/spo-oversight-contact', {
      title: 'Create an SPO Oversight contact | Manage a Workforce',
      data: response,
      name: response.name.combinedName,
      crn: response.crn,
      staffCode: response.staff.code,
      tier: response.tier,
      staffTeamCode,
      convictionNumber,
      errors: req.flash('errors') || [],
      pduCode,
      laoCase,
      instructions,
      person,
      isSensitive,
      emailCopyOptOut,
    })
  }
}

function filterEmptyEmails(form: ConfirmInstructionForm): ConfirmInstructionForm {
  return { ...form, person: form.person?.filter(person => person.email) }
}

function toArrayNotation(href: string) {
  /*
  validator returns:
  "person.0.email"
  we want:
  "person[0][email]"
  as ID
  */
  const parts = href.split(/\./)
  return parts.reduce((acc, text) => `${acc}[${text}]`)
}

function fixupArrayNotation({ text, href }: { text: string; href: string }) {
  return { text, href: toArrayNotation(href) }
}

function getChoosePractitionerDataByTeam(
  allocationInformationByTeam: ChoosePractitionerData,
  estateTeams: EstateTeam[],
): TeamOffenderManagersToAllocate[] {
  const practitionerTeams = new Array<TeamOffenderManagersToAllocate>()

  estateTeams.forEach(estateTeam => {
    const practitionersInTeam = (allocationInformationByTeam.teams[estateTeam.code] ?? []).map(practitioner => {
      const practitionerData = mapPractitioner(practitioner)
      return {
        ...practitionerData,
        teamCode: estateTeam.code,
        teamName: estateTeam.name,
        selectionCode: TeamAndStaffCode.encode(estateTeam.code, practitioner.code),
      }
    })
    practitionersInTeam.sort(sortPractitionersByGrade)
    practitionerTeams.push({
      isPerTeam: true,
      teamCode: estateTeam.code,
      teamName: estateTeam.name,
      offenderManagersToAllocate: practitionersInTeam,
    })
  })

  return practitionerTeams
}

function getChoosePractitionerDataAllTeams(
  offenderManagersToAllocateByTeam: TeamOffenderManagersToAllocate[],
): TeamOffenderManagersToAllocate {
  const practitionersInAllTeams = offenderManagersToAllocateByTeam.reduce(
    (accumulator, currentValue) => accumulator.concat(currentValue.offenderManagersToAllocate),
    new Array<OffenderManagerToAllocateWithTeam>(),
  )
  practitionersInAllTeams.sort(sortPractitionersByGrade)
  return {
    isPerTeam: false,
    teamCode: 'all-teams',
    teamName: 'All teams',
    offenderManagersToAllocate: practitionersInAllTeams,
  }
}

function mapPractitioner(practitionerData): OffenderManagerToAllocate {
  return {
    name: `${practitionerData.name?.forename} ${practitionerData.name?.surname}`,
    code: practitionerData.code,
    grade: practitionerData.grade,
    gradeTip: gradeTips.get(practitionerData.grade),
    gradeOrder: gradeOrder.get(practitionerData.grade) || 0,
    capacity: practitionerData.workload,
    totalCasesInLastWeek: practitionerData.casesPastWeek,
    communityCases: practitionerData.communityCases,
    custodyCases: practitionerData.custodyCases,
    email: practitionerData.email,
    laoCase: practitionerData.laoCase,
  }
}

function setStaffRestrictions(
  practitionerData: Record<string, Practitioner[]>,
  staffRestrictions: CrnStaffRestrictions,
): Record<string, Practitioner[]> {
  // convert array to map
  const staffMap = staffRestrictions.staffRestrictions.reduce((map, obj) => {
    return { ...map, [obj.staffCode]: obj.isExcluded }
  }, {})

  const authorisedPractitioners = { ...practitionerData }
  Object.entries(practitionerData).forEach(([teamCode, practitioners]) => {
    practitioners.forEach((practioner, index) => {
      authorisedPractitioners[teamCode][index] = { ...practioner, laoCase: staffMap[practioner.code] }
    })
  })

  return authorisedPractitioners
}

function getStaffCodes(practitionerData: Record<string, Practitioner[]>): string[] {
  /*
   iterate through practitioner data creating a list of staffCodes
   */
  const staffCodes = Object.values(practitionerData)
    .reduce((aggr, practitioners) => [...aggr, ...practitioners], [])
    .map(practitioner => practitioner.code)

  return staffCodes
}

function sortPractitionersByGrade(a, b) {
  if (b.gradeOrder === a.gradeOrder) {
    return a.capacity - b.capacity
  }
  return b.gradeOrder - a.gradeOrder
}

type TeamOffenderManagersToAllocate = {
  isPerTeam: boolean
  teamCode: string
  teamName: string
  offenderManagersToAllocate: OffenderManagerToAllocateWithTeam[]
}

type OffenderManagerToAllocate = {
  name: string
  code: string
  grade: string
  gradeOrder: number
  gradeTip: string
  capacity: number
  totalCasesInLastWeek: number
  communityCases: number
  custodyCases: number
  email?: string
  laoCase?: boolean
}

type OffenderManagerToAllocateWithTeam = OffenderManagerToAllocate & {
  teamCode: string
  teamName: string
  selectionCode: string
}
