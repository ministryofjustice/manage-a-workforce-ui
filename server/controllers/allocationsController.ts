import { Request, Response } from 'express'
import AllocationsService, { Allocation } from '../services/allocationsService'
import UnallocatedCase from './data/UnallocatedCase'

export default class AllocationsController {
  constructor(private readonly allocationsService: AllocationsService) {}

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
          value.offenderManager
        )
    )
    res.render('pages/index', {
      unallocatedCases,
      casesLength: response.length,
    })
  }

  async getUnallocatedCase(req: Request, res: Response, crn): Promise<void> {
    const response: Allocation = await this.allocationsService.getUnallocatedCase(res.locals.user.token, crn)
    const { session } = req
    session.name = response.name
    session.crn = crn
    session.tier = response.tier

    res.render('pages/summary', {
      data: response,
      title: 'Summary',
    })
  }

  getProbationRecord(req: Request, res: Response) {
    const { session } = req
    res.render('pages/probation-record', {
      title: 'Probation record',
      name: session.name,
      crn: session.crn,
      tier: session.tier,
    })
  }

  getRisk(req: Request, res: Response) {
    const { session } = req
    res.render('pages/risk', {
      title: 'Risk',
      name: session.name,
      crn: session.crn,
      tier: session.tier,
    })
  }

  getSummary(req: Request, res: Response) {
    const { session } = req
    res.render('pages/summary', {
      title: 'Summary',
      name: session.name,
    })
  }
}
