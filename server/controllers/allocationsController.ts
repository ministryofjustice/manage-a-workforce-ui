import { Request, Response } from 'express'
import AllocationsService from '../services/allocationsService'

export default class AllocationsController {
  constructor(private readonly allocationsService: AllocationsService) {}

  async getAllocations(req: Request, res: Response): Promise<void> {
    const response = await this.allocationsService.getUnallocatedCases(res.locals.user.token)
    res.render('pages/index', {
      unallocatedCases: response,
      casesLength: response.length > 99 ? '99+' : response.length,
    })
  }
}
