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

export default class AllocationsController {
  constructor(
    private readonly allocationsService: AllocationsService,
    private readonly workloadService: WorkloadService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly probationEstateService: ProbationEstateService
  ) {}

  async getUnallocatedCase(req: Request, res: Response, crn, convictionNumber, pduCode): Promise<void> {
    const response: Allocation = await this.allocationsService.getUnallocatedCase(
      res.locals.user.token,
      crn,
      convictionNumber
    )
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    const address = new DisplayAddress(response.address)
    response.name = unescapeApostrophe(response.name)
    res.render('pages/summary', {
      data: response,
      address,
      crn: response.crn,
      tier: response.tier,
      name: response.name,
      convictionNumber: response.convictionNumber,
      title: `${response.name} | Summary | Manage a workforce`,
      pduCode,
      outOfAreaTransfer: response.outOfAreaTransfer,
      laoCase,
      errors: req.flash('errors') || [],
    })
  }

  async getProbationRecord(req: Request, res: Response, crn, convictionNumber, pduCode): Promise<void> {
    const [unallocatedCase, probationRecord] = await Promise.all([
      await this.allocationsService.getUnallocatedCase(res.locals.user.token, crn, convictionNumber),
      await this.allocationsService.getProbationRecord(res.locals.user.token, crn, convictionNumber),
    ])
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
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
            activeRecord.offenderManager
          )
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
            activeRecord.offenderManager
          )
      )
      .slice(0, amountToSlice)
    res.render('pages/probation-record', {
      name: probationRecord.name,
      crn: probationRecord.crn,
      tier: probationRecord.tier,
      currentSentences,
      previousSentences,
      viewAll,
      totalPreviousCount,
      convictionNumber: probationRecord.convictionNumber,
      title: `${probationRecord.name} | Probation record | Manage a workforce`,
      pduCode,
      outOfAreaTransfer: unallocatedCase.outOfAreaTransfer,
      laoCase,
      errors: req.flash('errors') || [],
    })
  }

  async getRisk(req: Request, res: Response, crn: string, convictionNumber, pduCode: string) {
    const [unallocatedCase, risk] = await Promise.all([
      await this.allocationsService.getUnallocatedCase(res.locals.user.token, crn, convictionNumber),
      await this.allocationsService.getRisk(res.locals.user.token, crn, convictionNumber),
    ])
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    res.render('pages/risk', {
      title: `${risk.name} | Risk | Manage a workforce`,
      data: risk,
      crn: risk.crn,
      tier: risk.tier,
      name: risk.name,
      convictionNumber: risk.convictionNumber,
      pduCode,
      outOfAreaTransfer: unallocatedCase.outOfAreaTransfer,
      laoCase,
      errors: req.flash('errors') || [],
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
    res.render('pages/documents', {
      title: `${caseOverview.name} | Documents | Manage a workforce`,
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
    })
  }

  // eslint-disable-next-line consistent-return
  async choosePractitioner(req: Request, res: Response, crn, convictionNumber, pduCode) {
    const { token, username } = res.locals.user

    const teamCodesPreferences = await this.userPreferenceService.getTeamsUserPreference(token, username)
    const laoCase = await this.allocationsService.getLaoStatus(crn, token)
    const [allocationInformationByTeam, allTeamDetails] = await Promise.all([
      await this.workloadService.getChoosePractitionerData(token, crn, teamCodesPreferences.items),
      await this.probationEstateService.getTeamsByCode(token, teamCodesPreferences.items),
    ])

    if (laoCase === true) {
      // get the LAO status of each staffCode and add to allocation Information
      const staffRestrictions = await this.allocationsService.getRestrictedStatusByCrnAndStaffCodes(
        token,
        crn,
        getStaffCodes(allocationInformationByTeam.teams)
      )
      allocationInformationByTeam.teams = setStaffRestrictions(allocationInformationByTeam.teams, staffRestrictions)
    }

    const offenderManagersToAllocateByTeam = getChoosePractitionerDataByTeam(
      allocationInformationByTeam,
      allTeamDetails
    )
    const offenderManagersToAllocateAllTeams = getChoosePractitionerDataAllTeams(offenderManagersToAllocateByTeam)
    const offenderManagersToAllocatePerTeam = [offenderManagersToAllocateAllTeams].concat(
      offenderManagersToAllocateByTeam
    )

    const name = `${allocationInformationByTeam.name.forename} ${allocationInformationByTeam.name.surname}`
    const offenderManager = allocationInformationByTeam.communityPersonManager && {
      forenames: allocationInformationByTeam.communityPersonManager.name.forename,
      surname: allocationInformationByTeam.communityPersonManager.name.surname,
      grade: allocationInformationByTeam.communityPersonManager.grade,
    }
    const missingEmail = offenderManagersToAllocateAllTeams.offenderManagersToAllocate.some(i => !i.email)
    const error = req.query.error === 'true'
    return res.render('pages/choose-practitioner', {
      title: `${name} | Choose practitioner | Manage a workforce`,
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
        // eslint-disable-next-line security-node/detect-dangerous-redirects
        `/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocate/${chosenStaffTeamCode}/${staffCode}/allocate-to-practitioner`
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
    pduCode
  ) {
    const response: OffenderManagerPotentialWorkload = await this.workloadService.getCaseAllocationImpact(
      res.locals.user.token,
      crn,
      staffCode,
      staffTeamCode
    )
    const laoCase = await this.allocationsService.getLaoStatus(crn, req.user.token)
    response.name.combinedName = unescapeApostrophe(response.name.combinedName)
    response.name.surname = unescapeApostrophe(response.name.surname)
    res.render('pages/allocate-to-practitioner', {
      title: `${response.name.combinedName} | Allocate to practitioner | Manage a workforce`,
      data: response,
      name: response.name.combinedName,
      crn,
      tier: response.tier,
      convictionNumber,
      staffCode,
      staffTeamCode,
      pduCode,
      laoCase,
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
    scrollToBottom = false
  ) {
    const response: PersonOnProbationStaffDetails = await this.allocationsService.getConfirmInstructions(
      res.locals.user.token,
      crn,
      convictionNumber,
      staffCode
    )
    const laoCase = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    response.name.surname = unescapeApostrophe(response.name.surname)
    response.name.combinedName = unescapeApostrophe(response.name.combinedName)

    const confirmInstructionForm = {
      ...req.session.confirmInstructionForm,
      person: req.session.confirmInstructionForm?.person || [],
    }

    res.render('pages/confirm-instructions', {
      title: `${response.name.combinedName} | Review allocation notes | Manage a workforce`,
      data: response,
      name: response.name.combinedName,
      crn: response.crn,
      tier: response.tier,
      staffCode,
      staffTeamCode,
      convictionNumber: response.convictionNumber,
      errors: req.flash('errors') || [],
      confirmInstructionForm,
      pduCode,
      scrollToBottom,
      laoCase,
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
    scrollToBottom = false
  ) {
    const response: PersonOnProbationStaffDetails = await this.allocationsService.getConfirmInstructions(
      res.locals.user.token,
      crn,
      convictionNumber,
      staffCode
    )
    const laoCase = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    response.name.surname = unescapeApostrophe(response.name.surname)
    response.name.combinedName = unescapeApostrophe(response.name.combinedName)

    res.render('pages/check-edit-allocation-notes', {
      crn,
      staffCode,
      staffTeamCode,
      convictionNumber,
      pduCode,
      tier: response.tier,
      name: response.name.combinedName,
      data: response,
      scrollToBottom,
      laoCase,
    })
  }

  async getOverview(_, res: Response, crn, offenderManagerTeamCode, offenderManagerCode, convictionNumber, pduCode) {
    const [response, teamDetails] = await Promise.all([
      this.workloadService.getOffenderManagerOverview(
        res.locals.user.token,
        offenderManagerCode,
        offenderManagerTeamCode
      ),
      this.probationEstateService.getTeamDetails(res.locals.user.token, offenderManagerTeamCode),
    ])
    const data: OfficerView = new OfficerView(response)
    res.render('pages/officer-overview', {
      title: `${response.forename} ${response.surname} | Workload | Manage a workforce`,
      data,
      officerTeamCode: offenderManagerTeamCode,
      crn,
      convictionNumber,
      isOverview: true,
      pduCode,
      teamName: teamDetails.name,
    })
  }

  async getActiveCases(_, res: Response, crn, offenderManagerTeamCode, offenderManagerCode, convictionNumber, pduCode) {
    const [response, teamDetails] = await Promise.all([
      this.workloadService.getOffenderManagerCases(res.locals.user.token, offenderManagerCode, offenderManagerTeamCode),
      this.probationEstateService.getTeamDetails(res.locals.user.token, offenderManagerTeamCode),
    ])
    const cases = response.activeCases.map(
      activeCase => new Case(activeCase.crn, activeCase.tier, activeCase.type, activeCase.name.combinedName)
    )
    response.name.surname = unescapeApostrophe(response.name.surname)
    response.name.combinedName = unescapeApostrophe(response.name.combinedName)
    res.render('pages/active-cases', {
      title: `${response.name.combinedName} | Active cases | Manage a workforce`,
      data: response,
      officerTeamCode: offenderManagerTeamCode,
      cases,
      crn,
      convictionNumber,
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
    pduCode
  ) {
    const confirmInstructionForm = filterEmptyEmails(
      trimForm<ConfirmInstructionForm>({
        ...form,
        isSensitive: form.isSensitive === 'yes',
        emailCopyOptOut: form.emailCopyOptOut === 'yes',
      })
    )
    // const laoCase = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)

    if (form.remove !== undefined) {
      form.person.splice(form.remove, 1)
      req.session.confirmInstructionForm = { ...confirmInstructionForm, person: form.person }
      return res.redirect(
        // eslint-disable-next-line security-node/detect-dangerous-redirects
        `/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocate/${staffTeamCode}/${staffCode}/allocation-notes`
      )
    }
    switch (form.action) {
      case 'continue':
        req.session.confirmInstructionForm = confirmInstructionForm
        return res.redirect(
          // eslint-disable-next-line security-node/detect-dangerous-redirects
          `/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocate/${staffTeamCode}/${staffCode}/spo-oversight-contact-option`
        )
      case 'add-another-person':
        req.session.confirmInstructionForm = confirmInstructionForm
        return res.redirect(
          // eslint-disable-next-line security-node/detect-dangerous-redirects
          `/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocate/${staffTeamCode}/${staffCode}/allocation-notes`
        )
      default:
        return res.redirect(
          // eslint-disable-next-line security-node/detect-dangerous-redirects
          `/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocate/${staffTeamCode}/${staffCode}/allocation-notes`
        )
    }
  }

  async submitSpoOversight(
    req: Request,
    res: Response,
    crn,
    staffTeamCode,
    staffCode,
    convictionNumber: number,
    form,
    pduCode
  ) {
    const spoOversightForm = trimForm<ConfirmInstructionForm>({ ...form, isSensitive: form.isSensitive === 'yes' })
    // const laoCase = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    const errors = validate(
      spoOversightForm,
      { 'person.*.email': 'email', instructions: 'nourl' },
      {
        email: 'Enter an email address in the correct format, like name@example.com',
        nourl: 'You cannot include links in the allocation notes',
      }
    ).map(error => fixupArrayNotation(error))

    const confirmInstructionForm = {
      ...req.session.confirmInstructionForm,
      person: req.session.confirmInstructionForm?.person || [],
    }

    if (errors.length > 0) {
      req.session.confirmInstructionForm = spoOversightForm
      req.flash('errors', errors)
      return res.redirect(
        // eslint-disable-next-line security-node/detect-dangerous-redirects
        `/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocate/${staffCode}/${staffTeamCode}/spo-oversight-contact-option`
      )
    }
    const sendEmailCopyToAllocatingOfficer = !confirmInstructionForm.emailCopyOptOut
    const otherEmails = confirmInstructionForm.person.map(person => person.email).filter(email => email)

    const spoOversightContact = spoOversightForm.instructions
    const spoOversightSensitive = spoOversightForm.isSensitive
    const allocationNotes = confirmInstructionForm.instructions
    const allocationNotesSensitive = confirmInstructionForm.isSensitive
    const isSPOOversightAccessed = 'true'
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)

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
      laoCase
    )

    req.session.allocationForm = {
      otherEmails,
      sendEmailCopyToAllocatingOfficer,
    }

    req.session.confirmInstructionForm = null

    return res.redirect(
      // eslint-disable-next-line security-node/detect-dangerous-redirects
      `/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocation-complete`
    )
  }

  async submitNoSpoOversight(
    req: Request,
    res: Response,
    crn,
    staffTeamCode,
    staffCode,
    convictionNumber,
    form,
    pduCode
  ) {
    const confirmInstructionForm = {
      ...req.session.confirmInstructionForm,
      person: req.session.confirmInstructionForm?.person || [],
    }

    const sendEmailCopyToAllocatingOfficer = !confirmInstructionForm.emailCopyOptOut
    const otherEmails = confirmInstructionForm.person.map(person => person.email).filter(email => email)
    const spoOversightContact = confirmInstructionForm.instructions
    const spoOversightSensitive = confirmInstructionForm.isSensitive
    const allocationNotes = confirmInstructionForm.instructions
    const allocationNotesSensitive = confirmInstructionForm.isSensitive
    const isSPOOversightAccessed = 'false'
    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)

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
      laoCase
    )

    req.session.allocationForm = {
      otherEmails,
      sendEmailCopyToAllocatingOfficer,
    }

    req.session.confirmInstructionForm = null

    return res.redirect(
      // eslint-disable-next-line security-node/detect-dangerous-redirects
      `/pdu/${pduCode}/${crn}/convictions/${convictionNumber}/allocation-complete`
    )
  }

  async getSpoOversight(
    req: Request,
    res: Response,
    crn: string,
    staffTeamCode: string,
    staffCode: string,
    convictionNumber: string,
    pduCode: string
  ) {
    const response: PersonOnProbationStaffDetails = await this.allocationsService.getConfirmInstructions(
      res.locals.user.token,
      crn,
      convictionNumber,
      staffCode
    )

    const laoCase: boolean = await this.allocationsService.getLaoStatus(crn, res.locals.user.token)
    const confirmInstructionForm = {
      ...req.session.confirmInstructionForm,
      person: req.session.confirmInstructionForm?.person || [],
    }
    response.name.surname = unescapeApostrophe(response.name.surname)
    response.name.combinedName = unescapeApostrophe(response.name.combinedName)

    res.render('pages/spo-oversight-contact', {
      title: `${response.name.combinedName} | SPO Oversight Contact | Manage a workforce`,
      data: response,
      name: response.name.combinedName,
      crn: response.crn,
      staffCode: response.staff.code,
      tier: response.tier,
      staffTeamCode,
      convictionNumber,
      errors: req.flash('errors') || [],
      confirmInstructionForm,
      pduCode,
      laoCase,
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
  estateTeams: EstateTeam[]
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
  offenderManagersToAllocateByTeam: TeamOffenderManagersToAllocate[]
): TeamOffenderManagersToAllocate {
  const practitionersInAllTeams = offenderManagersToAllocateByTeam.reduce(
    (accumulator, currentValue) => accumulator.concat(currentValue.offenderManagersToAllocate),
    new Array<OffenderManagerToAllocateWithTeam>()
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
  staffRestrictions: CrnStaffRestrictions
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
