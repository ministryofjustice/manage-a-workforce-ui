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
import CaseOverview from './data/CaseOverview'
import OfficerView from './data/OfficerView'
import DisplayAddress from './data/DisplayAddress'

export default class AllocationsController {
  constructor(
    private readonly allocationsService: AllocationsService,
    private readonly workloadService: WorkloadService
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

  async getRisk(req: Request, res: Response, crn, convictionId, teamCode) {
    const response: Risk = await this.allocationsService.getRisk(res.locals.user.token, crn, convictionId)
    res.render('pages/risk', {
      title: `${response.name} | Risk | Manage a workforce`,
      data: response,
      crn: response.crn,
      convictionId: response.convictionId,
      teamCode,
    })
  }

  async getAllocate(req: Request, res: Response, crn, convictionId, teamCode) {
    const { token } = res.locals.user
    const { offenderManagers } = await this.workloadService.getOffenderManagersToAllocate(token)

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
            om.totalCasesInLastWeek
          )
      )
      .sort((a: AllocateOffenderManager, b: AllocateOffenderManager) => {
        if (b.gradeOrder === a.gradeOrder) {
          return b.capacity - a.capacity
        }
        return b.gradeOrder - a.gradeOrder
      })

    const response: Allocation = await this.allocationsService.getCaseOverview(token, crn, convictionId)
    const error = req.query.error === 'true'
    res.render('pages/allocate', {
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
    })
  }

  async selectAllocateOffenderManager(req: Request, res: Response, crn, convictionId, teamCode) {
    const {
      body: { allocatedOfficer },
    } = req
    if (allocatedOfficer) {
      return this.getAllocationImpact(req, res, crn, allocatedOfficer, convictionId, teamCode)
    }
    req.query.error = 'true'
    return this.getAllocate(req, res, crn, convictionId, teamCode)
  }

  async getAllocationImpact(req: Request, res: Response, crn, staffCode, convictionId, teamCode) {
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
      offenderManagerCode
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
      return this.getConfirmInstructions(req, res, crn, staffCode, convictionId, 'undefined')
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
