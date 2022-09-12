import { Request, Response } from 'express'

import UserPreferenceService from '../services/userPreferenceService'

export default class HomeController {
  constructor(private readonly userPreferenceService: UserPreferenceService) {}

  async redirectUser(req: Request, res: Response): Promise<void> {
    const { token, username } = res.locals.user
    const { items: teamSelection } = await this.userPreferenceService.getTeamsUserPreference(token, username)
    if (teamSelection.length) {
      res.redirect('/probationdeliveryunit/WPTNWS/teams')
    } else {
      res.redirect('/probationDeliveryUnit/WPTNWS/select-teams')
    }
  }
}