import { Request, Response } from 'express'
import AllocationsService from '../services/allocationsService'
import logger from '../../logger'

export default class AllocationsController {
  constructor(private readonly allocationsService: AllocationsService) {}

  async getAllocations(req: Request, res: Response): Promise<void> {
    const response = await this.allocationsService.getUnallocatedCases()
    logger.info(response)
    res.render('pages/index', { data: response })
  }
}
