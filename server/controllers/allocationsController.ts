import { Request, Response } from 'express'
import AllocationsService from '../services/allocationsService'

export default class AllocationsController {
  constructor(private readonly allocationsService: AllocationsService) {}

  async getAllocations(req: Request, res: Response): Promise<void> {
    const response = await this.allocationsService.getUnallocatedCases()
    console.log(response)
    res.render('pages/index', { data: response })
  }
}
