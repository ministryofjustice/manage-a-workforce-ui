import { NextFunction, Request, Response } from 'express'
import type { ConfirmInstructionForm } from 'forms'
import AllocationsService from '../services/allocationsService'
import Allocation from '../models/Allocation'
import ProbationRecord from '../models/ProbationRecord'
import Risk from '../models/Risk'
import UnallocatedCase from './data/UnallocatedCase'
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
import CaseOverview from './data/CaseOverview'

export default class AllocationsController {
  constructor(
    private readonly allocationsService: AllocationsService,
    private readonly workloadService: WorkloadService
  ) {}

  async getAllocations(req: Request, res: Response): Promise<void> {
    const response: Allocation[] = await this.allocationsService.getUnallocatedCases(res.locals.user.token)
    const unallocatedCases = response.map(
      value =>
        new UnallocatedCase(
          value.name,
          value.crn,
          value.tier,
          value.sentenceDate,
          value.initialAppointment,
          value.status,
          value.previousConvictionEndDate,
          value.offenderManager,
          value.convictionId,
          value.caseType
        )
    )
    const { session } = req
    session.casesLength = response.length
    res.render('pages/index', {
      unallocatedCases,
      casesLength: response.length,
      title: 'Unallocated cases | Manage a workforce',
    })
  }

  async getUnallocatedCase(req: Request, res: Response, crn, convictionId): Promise<void> {
    const response: Allocation = await this.allocationsService.getUnallocatedCase(
      res.locals.user.token,
      crn,
      convictionId
    )
    const { session } = req
    res.render('pages/summary', {
      data: response,
      crn: response.crn,
      convictionId: response.convictionId,
      title: `${response.name} | Summary | Manage a workforce`,
      casesLength: session.casesLength,
    })
  }

  async getProbationRecord(req: Request, res: Response, crn, convictionId): Promise<void> {
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
      casesLength: res.locals.casesLength,
    })
  }

  async getRisk(req: Request, res: Response, crn, convictionId) {
    const response: Risk = await this.allocationsService.getRisk(res.locals.user.token, crn, convictionId)
    res.render('pages/risk', {
      title: `${response.name} | Risk | Manage a workforce`,
      data: response,
      crn: response.crn,
      convictionId: response.convictionId,
      casesLength: res.locals.casesLength,
    })
  }

  async getAllocate(req: Request, res: Response, crn, convictionId) {
    const offenderManagersToAllocate = await this.workloadService
      .getOffenderManagersToAllocate(res.locals.user.token)
      .then(response =>
        response.offenderManagers
          .map(
            offenderManagerToAllocate =>
              new AllocateOffenderManager(
                offenderManagerToAllocate.forename,
                offenderManagerToAllocate.surname,
                offenderManagerToAllocate.grade,
                offenderManagerToAllocate.capacity,
                offenderManagerToAllocate.totalCommunityCases,
                offenderManagerToAllocate.totalCustodyCases,
                offenderManagerToAllocate.code,
                offenderManagerToAllocate.staffId,
                offenderManagerToAllocate.totalCasesInLastWeek
              )
          )
          .sort((a: AllocateOffenderManager, b: AllocateOffenderManager) => {
            if (b.gradeOrder === a.gradeOrder) {
              return b.capacity - a.capacity
            }
            return b.gradeOrder - a.gradeOrder
          })
      )
    const response: Allocation = await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionId)
    const error = req.query.error === 'true'
    res.render('pages/allocate', {
      title: `${response.name} | Choose practitioner | Manage a workforcee`,
      name: response.name,
      crn: response.crn,
      tier: response.tier,
      convictionId: response.convictionId,
      probationStatus: response.status,
      offenderManager: response.offenderManager,
      offenderManagersToAllocate,
      error,
      casesLength: res.locals.casesLength,
    })
  }

  async selectAllocateOffenderManager(req: Request, res: Response, crn, convictionId) {
    const {
      body: { allocatedOfficer },
    } = req
    if (allocatedOfficer) {
      return this.getAllocationImpact(req, res, crn, allocatedOfficer, convictionId)
    }
    req.query.error = 'true'
    return this.getAllocate(req, res, crn, convictionId)
  }

  async getAllocationImpact(req: Request, res: Response, crn, staffCode, convictionId) {
    const response: OffenderManagerPotentialWorkload = await this.workloadService.getCaseAllocationImpact(
      res.locals.user.token,
      crn,
      staffCode,
      convictionId
    )
    const caseOverview = await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionId)
    res.render('pages/confirm-allocation', {
      title: `${caseOverview.name} | Allocate to practitioner | Manage a workforce`,
      data: response,
      name: caseOverview.name,
      crn: caseOverview.crn,
      tier: caseOverview.tier,
      convictionId: caseOverview.convictionId,
      staffCode,
      casesLength: res.locals.casesLength,
    })
  }

  async getConfirmInstructions(req: Request, res: Response, crn, staffCode, convictionId) {
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
      casesLength: res.locals.casesLength,
      errors: req.flash('errors') || [],
      confirmInstructionForm: req.session.confirmInstructionForm || { person: [] },
    })
  }

  async getOverview(req: Request, res: Response, crn, offenderManagerCode, convictionId) {
    const response: OffenderManagerOverview = await this.workloadService.getOffenderManagerOverview(
      res.locals.user.token,
      offenderManagerCode
    )
    res.render('pages/overview', {
      title: `${response.forename} ${response.surname} | Workload | Manage a workforce`,
      data: response,
      crn,
      convictionId,
      casesLength: res.locals.casesLength,
      isOverview: true,
    })
  }

  async getActiveCases(req: Request, res: Response, crn, offenderManagerCode, convictionId) {
    const response: OffenderManagerCases = await this.workloadService.getOffenderManagerCases(
      res.locals.user.token,
      offenderManagerCode
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
      casesLength: res.locals.casesLength,
      isActiveCases: true,
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

  async allocateCaseToOffenderManager(req: Request, res: Response, crn, staffCode, convictionId, form) {
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
      return this.getConfirmInstructions(req, res, crn, staffCode, convictionId)
    }
    const response: OffenderManagerAllocatedCase = await this.workloadService.allocateCaseToOffenderManager(
      res.locals.user.token,
      crn,
      staffCode,
      convictionId,
      form.instructions,
      form.person.map(person => person.email).filter(email => email)
    )
    const personDetails: PersonManager = await this.workloadService.getPersonById(
      res.locals.user.token,
      response.personManagerId
    )
    const caseOverviewResponse = await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionId)
    const caseOverview = new CaseOverview(
      caseOverviewResponse.name,
      caseOverviewResponse.crn,
      caseOverviewResponse.tier,
      caseOverviewResponse.sentenceDate,
      caseOverviewResponse.initialAppointment,
      caseOverviewResponse.status,
      caseOverviewResponse.convictionId
    )

    return res.render('pages/allocation-complete', {
      title: `${caseOverview.name} | Case allocated | Manage a workforce`,
      data: response,
      crn,
      convictionId,
      casesLength: res.locals.casesLength,
      personDetails,
      addAnotherEmail: form.person,
      initialAppointment: caseOverview.initialAppointment,
      initialAppointmentDue: caseOverview.initialAppointmentDue,
      caseType: caseOverviewResponse.caseType,
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
