import { NextFunction, Request, Response } from 'express'
import AllocationsService from '../services/allocationsService'
import Allocation from '../models/allocation'
import ProbationRecord from '../models/probationRecord'
import Risk from '../models/risk'
import UnallocatedCase from './data/UnallocatedCase'
import Order from './data/Order'
import Conviction from '../models/conviction'
import AllocateOffenderManager from './data/AllocateOffenderManager'
import OffenderManagerPotentialWorkload from '../models/OffenderManagerPotentialWorkload'
import OffenderManagerOverview from '../models/offenderManagerOverview'
import FileDownload from '../models/fileDownload'
import WorkloadService from '../services/workloadService'
import OffenderManagerCases from '../models/offenderManagerCases'
import Case from './data/Case'
import StaffSummary from '../models/StaffSummary'
import OffenderManagerAllocatedCase from '../models/OffenderManagerAllocatedCase'

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
      title: 'Summary',
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
      title: 'Probation record',
      casesLength: res.locals.casesLength,
    })
  }

  async getRisk(req: Request, res: Response, crn, convictionId) {
    const response: Risk = await this.allocationsService.getRisk(res.locals.user.token, crn, convictionId)
    res.render('pages/risk', {
      title: 'Risk',
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
                offenderManagerToAllocate.staffId
              )
          )
          .sort((a: AllocateOffenderManager, b: AllocateOffenderManager) => b.capacity - a.capacity)
      )
    const response: Allocation = await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionId)
    const error = req.query.error === 'true'
    res.render('pages/allocate', {
      title: 'Allocate',
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
    let redirectUrl = `/${crn}/convictions/${convictionId}/allocate?error=true`
    if (allocatedOfficer) {
      redirectUrl = `/${crn}/convictions/${convictionId}/allocate/${allocatedOfficer}/confirm`
    }
    res.redirect(redirectUrl)
  }

  async getConfirmAllocation(req: Request, res: Response, crn, staffId, convictionId) {
    const response: OffenderManagerPotentialWorkload = await this.workloadService.getCaseAllocationImpact(
      res.locals.user.token,
      crn,
      staffId,
      convictionId
    )
    const caseOverview = await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionId)
    res.render('pages/confirm-allocation', {
      title: 'Allocation Impact',
      data: response,
      name: caseOverview.name,
      crn: caseOverview.crn,
      tier: caseOverview.tier,
      convictionId: caseOverview.convictionId,
      staffId,
      casesLength: res.locals.casesLength,
    })
  }

  async getConfirmInstructions(req: Request, res: Response, crn, staffId, convictionId) {
    const response: StaffSummary = await this.workloadService.getStaffById(res.locals.user.token, staffId)
    const caseOverview = await this.allocationsService.getCaseOverview(res.locals.user.token, crn, convictionId)
    res.render('pages/confirm-instructions', {
      title: 'Instructions',
      data: response,
      name: caseOverview.name,
      crn: caseOverview.crn,
      tier: caseOverview.tier,
      staffId,
      convictionId: caseOverview.convictionId,
      casesLength: res.locals.casesLength,
    })
  }

  async getOverview(req: Request, res: Response, crn, offenderManagerCode, convictionId) {
    const response: OffenderManagerOverview = await this.workloadService.getOffenderManagerOverview(
      res.locals.user.token,
      offenderManagerCode
    )
    res.render('pages/overview', {
      title: 'Overview',
      data: response,
      crn,
      convictionId,
      casesLength: res.locals.casesLength,
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
      title: 'Active cases',
      data: response,
      cases,
      crn,
      convictionId,
      casesLength: res.locals.casesLength,
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

  async allocateCaseToOffenderManager(req: Request, res: Response, crn, staffId, convictionId, instructions) {
    const response: OffenderManagerAllocatedCase = await this.workloadService.allocateCaseToOffenderManager(
      res.locals.user.token,
      crn,
      staffId,
      convictionId,
      instructions
    )
    res.render('pages/allocation-complete', {
      title: 'Allocation complete',
      data: response,
      crn,
      convictionId,
      casesLength: res.locals.casesLength,
    })
  }
}
