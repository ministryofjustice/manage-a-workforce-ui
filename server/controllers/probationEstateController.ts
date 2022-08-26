import { Request, Response } from 'express'
import EstateTeam from '../models/EstateTeam'
import ProbationEstateService from '../services/probationEstateService'

export default class ProbationEstateController {
  constructor(private readonly probationEstateService: ProbationEstateService) {}

  async getPduTeams(req: Request, res: Response, pduCode) {
    const response: EstateTeam[] = await this.probationEstateService.getProbationDeliveryUnitTeams(
      pduCode,
      res.locals.user.token
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
      return this.getSelectedTeams(req, res)
    }
    req.query.error = 'true'
    return this.getPduTeams(req, res, pduCode)
  }

  async getSelectedTeams(req: Request, res: Response) {
    res.render('pages/selected-teams', {
      title: 'Allocate cases by team | Manage a workforce',
    })
  }
}
