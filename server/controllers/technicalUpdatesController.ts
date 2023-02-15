import { Request, Response } from 'express'

export default class TechnicalUpdatesController {
  async getTechnicalUpdates(req: Request, res: Response): Promise<void> {
    return res.render('pages/technical-updates', {
      title: `Technical updates | Manage a workforce`,
      referrer: req.get('Referrer'),
    })
  }
}
