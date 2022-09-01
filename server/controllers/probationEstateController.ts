import { Request, Response } from 'express'
import EstateTeam from '../models/EstateTeam'
import ProbationEstateService from '../services/probationEstateService'
import AllocationsService from '../services/allocationsService'
import WorkloadService from '../services/workloadService'

export default class ProbationEstateController {
  constructor(
    private readonly probationEstateService: ProbationEstateService,
    private readonly allocationService: AllocationsService,
    private readonly workloadService: WorkloadService
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
    const [allocationCasesByTeam, workloadByTeam, probationEstateTeams] = await Promise.all([
      this.allocationService.getCaseCountByTeamCodes(res.locals.user.token, teamCodes),
      this.workloadService.getWorkloadByTeams(res.locals.user.token, teamCodes),
      this.probationEstateService.getTeamsByCode(res.locals.user.token, teamCodes),
    ])
    const caseInformationByTeam = probationEstateTeams
      .map(team => {
        const teamWorkload = workloadByTeam.find(w => w.teamCode === team.code) ?? {
          totalCases: '-',
          workload: '-',
        }
        const teamAllocations = allocationCasesByTeam.find(uc => uc.teamCode === team.code) ?? {
          caseCount: 0,
        }

        return {
          teamName: team.name,
          workload: `${teamWorkload.workload}%`,
          caseCount: teamWorkload.totalCases,
          unallocatedCaseCount: teamAllocations.caseCount,
        }
      })
      .sort((a, b) => a.teamName.localeCompare(b.teamName))
    res.render('pages/allocate-cases-by-team', {
      title: 'Allocate cases by team | Manage a workforce',
      teams: caseInformationByTeam,
      pduCode,
    })
  }
}
