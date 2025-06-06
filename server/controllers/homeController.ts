import { Response } from 'express'

import UserPreferenceService from '../services/userPreferenceService'

export default class HomeController {
  constructor(private readonly userPreferenceService: UserPreferenceService) {}

  async redirectUser(_, res: Response): Promise<void> {
    const { token, username } = res.locals.user
    const { items: pduSelection } = await this.userPreferenceService.getPduUserPreference(token, username)
    if (pduSelection.length) {
      res.redirect(`/pdu/${pduSelection[0]}/teams`)
    } else {
      res.redirect('/regions')
    }
  }
}
