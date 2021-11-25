import { Request, Response } from 'express'
import AllocationsService from '../services/allocationsService'

export default class AllocationsController {
  constructor(private readonly allocationsService: AllocationsService) {}

  getCaseCount(caseCount: number): string {
    if (caseCount) {
      return caseCount > 99 ? '99+' : `${caseCount}`
    }
    return undefined
  }

  async getAllocations(req: Request, res: Response): Promise<void> {
    const response = await this.allocationsService.getUnallocatedCases(res.locals.user.token)
    const caseCount = this.getCaseCount(response.length)
    const caseCountHeader = caseCount ? ` (${caseCount})` : ''
    res.render('pages/index', {
      unallocatedCases: response,
      unallocatedCaseSubnavHeading: `Unallocated community cases${caseCountHeader}`,
      casesLength: caseCount,
    })
  }
}
