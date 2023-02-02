import { Request, Response } from 'express'
import type { ConfirmInstructionForm } from 'forms'
import AllocationsService from '../services/allocationsService'
import Allocation from '../models/Allocation'
import ProbationRecord from '../models/ProbationRecord'
import Risk from '../models/Risk'
import Order from './data/Order'
import Conviction from '../models/Conviction'
import { gradeOrder, gradeTips } from './data/AllocateOffenderManager'
import OffenderManagerPotentialWorkload from '../models/OffenderManagerPotentialWorkload'
import OffenderManagerOverview from '../models/OffenderManagerOverview'
import FileDownload from '../models/FileDownload'
import WorkloadService from '../services/workloadService'
import OffenderManagerCases from '../models/OffenderManagerCases'
import Case from './data/Case'
import StaffSummary from '../models/StaffSummary'
import PersonManager from '../models/PersonManager'
import OffenderManagerAllocatedCase from '../models/OffenderManagerAllocatedCase'
import validate from '../validation/validation'
import trimForm from '../utils/trim'
import OfficerView from './data/OfficerView'
import DisplayAddress from './data/DisplayAddress'
import ProbationEstateService from '../services/probationEstateService'
import DocumentRow from './data/DocumentRow'
import ChoosePractitionerData, { Practitioner } from '../models/ChoosePractitionerData'
import UserPreferenceService from '../services/userPreferenceService'
import { TeamAndStaffCode } from '../utils/teamAndStaffCode'

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
    const address = new DisplayAddress(response.address)
    res.render('pages/summary', {
      data: response,
      address,
      crn: response.crn,
      tier: response.tier,
      name: response.name,
      convictionNumber: response.convictionNumber,
      title: `${response.name} | Summary | Manage a workforce`,
      pduCode,
    })
  }

  async getProbationRecord(req: Request, res: Response, crn, convictionNumber, pduCode): Promise<void> {
    const response: ProbationRecord = await this.allocationsService.getProbationRecord(
      res.locals.user.token,
      crn,
      convictionNumber
    )
    const totalPreviousCount = response.previous.length
    const viewAll = totalPreviousCount <= 3 ? true : req.query.viewAll
    const amountToSlice = viewAll ? totalPreviousCount : 3
    const currentOrders = response.active
      .sort((a: Conviction, b: Conviction) => Date.parse(b.startDate) - Date.parse(a.startDate))
      .map(
        activeRecord =>
          new Order(
            activeRecord.description,
            activeRecord.length,
            activeRecord.offences,
            activeRecord.startDate,
            activeRecord.offenderManager
          )
      )
    const previousOrders = response.previous
      .sort((a: Conviction, b: Conviction) => Date.parse(b.endDate) - Date.parse(a.endDate))
      .map(
        activeRecord =>
          new Order(
            activeRecord.description,
            activeRecord.length,
            activeRecord.offences,
            activeRecord.endDate,
            activeRecord.offenderManager
          )
      )
      .slice(0, amountToSlice)
    res.render('pages/probation-record', {
      name: response.name,
      crn: response.crn,
      tier: response.tier,
      currentOrders,
      previousOrders,
      viewAll,
      totalPreviousCount,
      convictionNumber: response.convictionNumber,
      title: `${response.name} | Probation record | Manage a workforce`,
      pduCode,
    })
  }

  async getRisk(_, res: Response, crn: string, convictionNumber, pduCode: string) {
    const response: Risk = await this.allocationsService.getRisk(res.locals.user.token, crn, convictionNumber)
    res.render('pages/risk', {
      title: `${response.name} | Risk | Manage a workforce`,
      data: response,
      crn: response.crn,
      tier: response.tier,
      name: response.name,
      convictionNumber: response.convictionNumber,
      pduCode,
    })
  }

  async getDocuments(_, res: Response, crn: string, convictionNumber, pduCode: string) {
    const caseOverview = await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionNumber)
    const documents = await this.allocationsService.getDocuments(res.locals.user.token, crn)
    const documentRows = documents.map(document => new DocumentRow(document))
    res.render('pages/documents', {
      title: `${caseOverview.name} | Documents | Manage a workforce`,
      crn: caseOverview.crn,
      tier: caseOverview.tier,
      name: caseOverview.name,
      convictionNumber: caseOverview.convictionNumber,
      pduCode,
      documents: documentRows,
    })
  }

  // eslint-disable-next-line consistent-return
  async choosePractitioner(req: Request, res: Response, crn, convictionNumber, pduCode) {
    const { token, username } = res.locals.user

    const teamCodesPreferences = await this.userPreferenceService.getTeamsUserPreference(token, username)

    const [allocationInformationByTeam, allTeamDetails] = await Promise.all([
      await this.workloadService.getChoosePractitionerData(token, crn, teamCodesPreferences.items),
      await this.probationEstateService.getTeamsByCode(token, teamCodesPreferences.items),
    ])

    const teamNamesByCode = new Map(allTeamDetails.map(obj => [obj.code, obj.name]))

    const offenderManagersToAllocateByTeam = getChoosePractitionerDataByTeam(
      allocationInformationByTeam,
      teamNamesByCode
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

  async getAllocateToPractitioner(_, res: Response, crn, staffTeamCode, staffCode, convictionNumber, pduCode) {
    const response: OffenderManagerPotentialWorkload = await this.workloadService.getCaseAllocationImpact(
      res.locals.user.token,
      crn,
      staffCode,
      staffTeamCode
    )
    const caseOverview = await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionNumber)
    res.render('pages/allocate-to-practitioner', {
      title: `${caseOverview.name} | Allocate to practitioner | Manage a workforce`,
      data: response,
      name: caseOverview.name,
      crn: caseOverview.crn,
      tier: caseOverview.tier,
      convictionNumber: caseOverview.convictionNumber,
      staffCode,
      staffTeamCode,
      pduCode,
    })
  }

  async getConfirmInstructions(req: Request, res: Response, crn, staffTeamCode, staffCode, convictionNumber, pduCode) {
    const response: StaffSummary = await this.workloadService.getStaffByCode(res.locals.user.token, staffCode)
    const caseOverview = await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionNumber)
    const useEmailLookup = req.query.autocomplete
    res.render('pages/confirm-instructions', {
      useEmailLookup,
      title: `${caseOverview.name} | Review allocation instructions | Manage a workforce`,
      data: response,
      name: caseOverview.name,
      crn: caseOverview.crn,
      tier: caseOverview.tier,
      staffCode,
      staffTeamCode,
      convictionNumber: caseOverview.convictionNumber,
      errors: req.flash('errors') || [],
      confirmInstructionForm: req.session.confirmInstructionForm || { person: [] },
      pduCode,
    })
  }

  async getOverview(_, res: Response, crn, offenderManagerTeamCode, offenderManagerCode, convictionNumber, pduCode) {
    const response: OffenderManagerOverview = await this.workloadService.getOffenderManagerOverview(
      res.locals.user.token,
      offenderManagerCode,
      offenderManagerTeamCode
    )
    const data: OfficerView = new OfficerView(response)
    res.render('pages/officer-overview', {
      title: `${response.forename} ${response.surname} | Workload | Manage a workforce`,
      data,
      officerTeamCode: offenderManagerTeamCode,
      crn,
      convictionNumber,
      isOverview: true,
      pduCode,
    })
  }

  async getActiveCases(
    req: Request,
    res: Response,
    crn,
    offenderManagerTeamCode,
    offenderManagerCode,
    convictionNumber,
    pduCode
  ) {
    const response: OffenderManagerCases = await this.workloadService.getOffenderManagerCases(
      res.locals.user.token,
      offenderManagerCode,
      offenderManagerTeamCode
    )
    const cases = response.activeCases.map(
      activeCase =>
        new Case(activeCase.crn, activeCase.tier, activeCase.caseCategory, activeCase.forename, activeCase.surname)
    )
    res.render('pages/active-cases', {
      title: `${response.forename} ${response.surname} | Active cases | Manage a workforce`,
      data: response,
      officerTeamCode: offenderManagerTeamCode,
      cases,
      crn,
      convictionNumber,
      isActiveCases: true,
      pduCode,
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
    const confirmInstructionForm = filterEmptyEmails(trimForm<ConfirmInstructionForm>(form))
    const errors = validate(
      confirmInstructionForm,
      { 'person.*.email': 'email' },
      {
        email: 'Enter an email address in the correct format, like name@example.com',
      }
    ).map(error => fixupArrayNotation(error))

    if (errors.length > 0) {
      req.session.confirmInstructionForm = confirmInstructionForm
      req.flash('errors', errors)
      return this.getConfirmInstructions(req, res, crn, staffTeamCode, staffCode, convictionNumber, pduCode)
    }
    const sendEmailCopyToAllocatingOfficer = !form.emailCopy
    const otherEmails = form.person.map(person => person.email).filter(email => email)
    const caseOverviewResponse = await this.allocationsService.getCaseOverview(
      res.locals.user.token,
      crn,
      convictionNumber
    )

    const response: OffenderManagerAllocatedCase = await this.workloadService.allocateCaseToOffenderManager(
      res.locals.user.token,
      crn,
      staffCode,
      caseOverviewResponse.convictionId,
      staffTeamCode,
      form.instructions,
      otherEmails,
      sendEmailCopyToAllocatingOfficer,
      caseOverviewResponse.convictionNumber
    )
    const personDetails: PersonManager = await this.workloadService.getPersonById(
      res.locals.user.token,
      response.personManagerId
    )

    return res.render('pages/allocation-complete', {
      title: `${caseOverviewResponse.name} | Case allocated | Manage a workforce`,
      data: response,
      crn,
      convictionNumber: caseOverviewResponse.convictionNumber,
      personName: caseOverviewResponse.name,
      personDetails,
      otherEmails,
      initialAppointment: caseOverviewResponse.initialAppointment,
      caseType: caseOverviewResponse.caseType,
      pduCode,
      sendEmailCopyToAllocatingOfficer,
    })
  }
}

function filterEmptyEmails(form: ConfirmInstructionForm): ConfirmInstructionForm {
  return { ...form, person: form.person.filter(person => person.email) }
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
  teamNamesByCode: Map<string, string>
): TeamOffenderManagersToAllocate[] {
  const practitionerTeams = new Array<TeamOffenderManagersToAllocate>()
  Object.entries(allocationInformationByTeam.teams).forEach(teamCodeAndPractitioner => {
    const teamCode = teamCodeAndPractitioner[0]
    const practitionersInTeam = (teamCodeAndPractitioner[1] as Practitioner[]).map(practitioner => {
      const practitionerData = mapPractitioner(practitioner)
      return {
        ...practitionerData,
        teamCode,
        teamName: teamNamesByCode.get(teamCode),
        selectionCode: TeamAndStaffCode.encode(teamCode, practitioner.code),
      }
    })
    practitionersInTeam.sort(sortPractitionersByGrade)
    practitionerTeams.push({
      isPerTeam: true,
      teamCode,
      teamName: teamNamesByCode.get(teamCode),
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
  }
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
}

type OffenderManagerToAllocateWithTeam = OffenderManagerToAllocate & {
  teamCode: string
  teamName: string
  selectionCode: string
}
