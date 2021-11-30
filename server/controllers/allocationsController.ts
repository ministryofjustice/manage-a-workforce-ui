import { Request, Response } from 'express'
import AllocationsService, { Allocation } from '../services/allocationsService'
import UnallocatedCase from './data/UnallocatedCase'

export default class AllocationsController {
  constructor(private readonly allocationsService: AllocationsService) {}

  getCaseCount(caseCount: number): string {
    if (caseCount) {
      return caseCount > 99 ? '99+' : `${caseCount}`
    }
    return undefined
  }

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
          value.previousConvictionEndDate
        )
    )
    const caseCount = this.getCaseCount(response.length)
    const caseCountHeader = caseCount ? ` (${caseCount})` : ''
    res.render('pages/index', {
      unallocatedCases,
      unallocatedCaseSubnavHeading: `Unallocated community cases${caseCountHeader}`,
      casesLength: caseCount,
    })
  }
}
