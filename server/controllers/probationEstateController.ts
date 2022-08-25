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
    res.render('pages/select-teams', {
      title: `Select your teams | Manage a workforce`,
      data: response.sort((a, b) => a.name.localeCompare(b.name)),
    })
  }
}
