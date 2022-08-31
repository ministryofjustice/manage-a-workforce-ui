import { Request, Response } from 'express'
import EstateTeam from '../models/EstateTeam'
import ProbationEstateService from '../services/probationEstateService'
import AllocationsService from '../services/allocationsService'

export default class ProbationEstateController {
  constructor(
    private readonly probationEstateService: ProbationEstateService,
    private readonly allocationService: AllocationsService
  ) {}

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
      return this.getAllocateCasesByTeam(req, res, pduCode)
    }
    req.query.error = 'true'
    return this.getPduTeams(req, res, pduCode)
  }

  async getAllocateCasesByTeam(req: Request, res: Response, pduCode) {
    const {
      body: { team: teams },
    } = req
    const teamCodes = Array.isArray(teams) ? teams : [teams]
    const allocationCasesByTeam = await this.allocationService.getCaseCountByTeamCodes(res.locals.user.token, teamCodes)
    res.render('pages/allocate-cases-by-team', {
      title: 'Allocate cases by team | Manage a workforce',
      teams: allocationCasesByTeam,
      pduCode,
    })
  }
}
