import { Request, Response } from 'express'
import EstateTeam from '../models/EstateTeam'
import EstateRegion from '../models/EstateRegion'
import ProbationEstateService from '../services/probationEstateService'
import UserPreferenceService from '../services/userPreferenceService'

export default class ProbationEstateController {
  constructor(
    private readonly probationEstateService: ProbationEstateService,
    private readonly userPreferenceService: UserPreferenceService
  ) {}

  async getPduTeams(req: Request, res: Response, pduCode) {
    const response: EstateTeam[] = await this.probationEstateService.getProbationDeliveryUnitTeams(
      res.locals.user.token,
      pduCode
    )
    const error = req.query.error === 'true'
    res.render('pages/select-teams', {
      title: `Select your teams | Manage a workforce`,
      data: response.sort((a, b) => a.name.localeCompare(b.name)),
      error,
    })
  }

  async selectPduTeams(req: Request, res: Response, pduCode) {
    const {
      body: { team },
    } = req
    if (team) {
      const teamCodes = Array.isArray(team) ? team : [team]
      await this.userPreferenceService.saveTeamsUserPreference(
        res.locals.user.token,
        res.locals.user.username,
        teamCodes
      )

      // eslint-disable-next-line security-node/detect-dangerous-redirects
      return res.redirect(`/probationDeliveryUnit/${pduCode}/teams`)
    }
    req.query.error = 'true'
    return this.getPduTeams(req, res, pduCode)
  }

  async getRegions(req: Request, res: Response) {
    const response: EstateRegion[] = await this.probationEstateService.getRegions(res.locals.user.token)
    res.render('pages/select-region', {
      title: `Select your region | Manage a workforce`,
      data: response.sort((a, b) => a.name.localeCompare(b.name)),
    })
  }
}
