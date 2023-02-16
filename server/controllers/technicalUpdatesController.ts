import { Request, Response } from 'express'
import TechnicalUpdatesService from '../services/technicalUpdatesService'

export default class TechnicalUpdatesController {
  constructor(private readonly technicalUpdatesService: TechnicalUpdatesService) {}

  async getTechnicalUpdates(req: Request, res: Response): Promise<void> {
    return res.render('pages/technical-updates', {
      title: `Technical updates | Manage a workforce`,
      referrer: req.get('Referrer'),
      technicalUpdates: this.technicalUpdatesService.getTechnicalUpdates(),
    })
  }
}
