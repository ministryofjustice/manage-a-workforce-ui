import { NextFunction, Request, Response } from 'express'
import type { ConfirmInstructionForm } from 'forms'
import AllocationsService from '../services/allocationsService'
import Allocation from '../models/Allocation'
import ProbationRecord from '../models/ProbationRecord'
import Risk from '../models/Risk'
import Order from './data/Order'
import Conviction from '../models/Conviction'
import AllocateOffenderManager from './data/AllocateOffenderManager'
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
import CaseForChoosePractitioner from '../models/CaseForChoosePractitioner'

export default class AllocationsController {
  constructor(
    private readonly allocationsService: AllocationsService,
    private readonly workloadService: WorkloadService,
    private readonly probationEstateService: ProbationEstateService
  ) {}

  async getUnallocatedCase(req: Request, res: Response, crn, convictionId, teamCode): Promise<void> {
    const response: Allocation = await this.allocationsService.getUnallocatedCase(
      res.locals.user.token,
      crn,
      convictionId
    )
    const address = new DisplayAddress(response.address)
    res.render('pages/summary', {
      data: response,
      address,
      crn: response.crn,
      tier: response.tier,
      name: response.name,
      convictionId: response.convictionId,
      title: `${response.name} | Summary | Manage a workforce`,
      teamCode,
    })
  }

  async getProbationRecord(req: Request, res: Response, crn, convictionId, teamCode): Promise<void> {
    const response: ProbationRecord = await this.allocationsService.getProbationRecord(
      res.locals.user.token,
      crn,
      convictionId
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
            activeRecord.lengthUnit,
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
            activeRecord.lengthUnit,
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
      convictionId,
      title: `${response.name} | Probation record | Manage a workforce`,
      teamCode,
    })
  }

  async getRisk(_, res: Response, crn: string, convictionId, teamCode: string) {
    const response: Risk = await this.allocationsService.getRisk(res.locals.user.token, crn, convictionId)
    res.render('pages/risk', {
      title: `${response.name} | Risk | Manage a workforce`,
      data: response,
      crn: response.crn,
      tier: response.tier,
      name: response.name,
      convictionId: response.convictionId,
      teamCode,
    })
  }

  async choosePractitioner(req: Request, res: Response, crn, convictionId, teamCode) {
    const { token } = res.locals.user
    const { offenderManagers } = await this.workloadService.getOffenderManagersToAllocate(token, teamCode)
    const { name: teamName } = await this.probationEstateService.getTeamDetailsByCode(token, teamCode)

    const offenderManagersToAllocate = offenderManagers
      .map(
        om =>
          new AllocateOffenderManager(
            om.forename,
            om.surname,
            om.grade,
            om.capacity,
            om.totalCommunityCases,
            om.totalCustodyCases,
            om.code,
            om.staffId,
            om.totalCasesInLastWeek,
            om.email
          )
      )
      .sort((a: AllocateOffenderManager, b: AllocateOffenderManager) => {
        if (b.gradeOrder === a.gradeOrder) {
          return a.capacity - b.capacity
        }
        return b.gradeOrder - a.gradeOrder
      })

    const response: CaseForChoosePractitioner = await this.allocationsService.getCaseForChoosePractitioner(
      token,
      crn,
      convictionId
    )
    const error = req.query.error === 'true'
    res.render('pages/choose-practitioner', {
      title: `${response.name} | Choose practitioner | Manage a workforce`,
      name: response.name,
      crn: response.crn,
      tier: response.tier,
      convictionId: response.convictionId,
      probationStatus: response.status,
      offenderManager: response.offenderManager,
      offenderManagersToAllocate,
      error,
      teamCode,
      teamName,
    })
  }

  async selectAllocateOffenderManager(req: Request, res: Response, crn, convictionId, teamCode) {
    const {
      body: { allocatedOfficer: staffCode },
    } = req
    if (staffCode) {
      return res.redirect(
        // eslint-disable-next-line security-node/detect-dangerous-redirects
        `/team/${teamCode}/${crn}/convictions/${convictionId}/allocate/${staffCode}/allocate-to-practitioner`
      )
    }
    req.query.error = 'true'
    return this.choosePractitioner(req, res, crn, convictionId, teamCode)
  }

  async getAllocateToPractitioner(_, res: Response, crn, staffCode, convictionId, teamCode) {
    const response: OffenderManagerPotentialWorkload = await this.workloadService.getCaseAllocationImpact(
      res.locals.user.token,
      crn,
      staffCode,
      convictionId,
      teamCode
    )
    const caseOverview = await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionId)
    res.render('pages/allocate-to-practitioner', {
      title: `${caseOverview.name} | Allocate to practitioner | Manage a workforce`,
      data: response,
      name: caseOverview.name,
      crn: caseOverview.crn,
      tier: caseOverview.tier,
      convictionId: caseOverview.convictionId,
      staffCode,
      teamCode,
    })
  }

  async getConfirmInstructions(req: Request, res: Response, crn, staffCode, convictionId, teamCode) {
    const response: StaffSummary = await this.workloadService.getStaffByCode(res.locals.user.token, staffCode)
    const caseOverview = await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionId)
    res.render('pages/confirm-instructions', {
      title: `${caseOverview.name} | Review allocation instructions | Manage a workforce`,
      data: response,
      name: caseOverview.name,
      crn: caseOverview.crn,
      tier: caseOverview.tier,
      staffCode,
      convictionId: caseOverview.convictionId,
      errors: req.flash('errors') || [],
      confirmInstructionForm: req.session.confirmInstructionForm || { person: [] },
      teamCode,
    })
  }

  async getOverview(req: Request, res: Response, crn, offenderManagerCode, convictionId, teamCode) {
    const response: OffenderManagerOverview = await this.workloadService.getOffenderManagerOverview(
      res.locals.user.token,
      offenderManagerCode,
      teamCode
    )
    const data: OfficerView = new OfficerView(response)
    res.render('pages/overview', {
      title: `${response.forename} ${response.surname} | Workload | Manage a workforce`,
      data,
      crn,
      convictionId,
      isOverview: true,
      teamCode,
    })
  }

  async getActiveCases(req: Request, res: Response, crn, offenderManagerCode, convictionId, teamCode) {
    const response: OffenderManagerCases = await this.workloadService.getOffenderManagerCases(
      res.locals.user.token,
      offenderManagerCode,
      teamCode
    )
    const cases = response.activeCases.map(
      activeCase =>
        new Case(activeCase.crn, activeCase.tier, activeCase.caseCategory, activeCase.forename, activeCase.surname)
    )
    res.render('pages/active-cases', {
      title: `${response.forename} ${response.surname} | Active cases | Manage a workforce`,
      data: response,
      cases,
      crn,
      convictionId,
      isActiveCases: true,
      teamCode,
    })
  }

  async getDocument(req: Request, res: Response, next: NextFunction, crn, convictionId, documentId) {
    const response: FileDownload = await this.allocationsService.getDocument(
      res.locals.user.token,
      crn,
      convictionId,
      documentId
    )
    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })
    response.data.pipe(res)
    response.data.on('end', next)
  }

  async allocateCaseToOffenderManager(req: Request, res: Response, crn, staffCode, convictionId, form, teamCode) {
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
      return this.getConfirmInstructions(req, res, crn, staffCode, convictionId, teamCode)
    }
    const sendEmailCopyToAllocatingOfficer = !form.emailCopy
    const otherEmails = form.person.map(person => person.email).filter(email => email)
    const response: OffenderManagerAllocatedCase = await this.workloadService.allocateCaseToOffenderManager(
      res.locals.user.token,
      crn,
      staffCode,
      convictionId,
      teamCode,
      form.instructions,
      otherEmails,
      sendEmailCopyToAllocatingOfficer
    )
    const personDetails: PersonManager = await this.workloadService.getPersonById(
      res.locals.user.token,
      response.personManagerId
    )
    const caseOverviewResponse = await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionId)

    return res.render('pages/allocation-complete', {
      title: `${caseOverviewResponse.name} | Case allocated | Manage a workforce`,
      data: response,
      crn,
      convictionId,
      personDetails,
      otherEmails,
      initialAppointment: caseOverviewResponse.initialAppointment,
      caseType: caseOverviewResponse.caseType,
      teamCode,
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
