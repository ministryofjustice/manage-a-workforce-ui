import { Request, Response } from 'express'
import AllocationsService from '../services/allocationsService'
import ProbationEstateService from '../services/probationEstateService'
import UserPreferenceService from '../services/userPreferenceService'
import WorkloadService from '../services/workloadService'

export default class AllocateCasesController {
  constructor(
    private readonly allocationsService: AllocationsService,
    private readonly probationEstateService: ProbationEstateService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly workloadService: WorkloadService
  ) {}

  async getDataByTeams(req: Request, res: Response, pduCode: string) {
    const { token, username } = res.locals.user
    const teamCodes = (await this.userPreferenceService.getTeamsUserPreference(token, username)).items
    let caseInformationByTeam = []
    if (teamCodes.length) {
      const [allocationCasesByTeam, workloadByTeam, probationEstateTeams] = await Promise.all([
        this.allocationsService.getCaseCountByTeamCodes(token, teamCodes),
        this.workloadService.getWorkloadByTeams(token, teamCodes),
        this.probationEstateService.getTeamsByCode(token, teamCodes),
      ])
      caseInformationByTeam = probationEstateTeams
        .map(team => {
          const teamWorkload = workloadByTeam.find(w => w.teamCode === team.code) ?? {
            totalCases: '-',
            workload: '-',
          }
          const teamAllocations = allocationCasesByTeam.find(uc => uc.teamCode === team.code) ?? {
            caseCount: 0,
          }

          return {
            teamCode: team.code,
            teamName: team.name,
            workload: `${teamWorkload.workload}%`,
            caseCount: teamWorkload.totalCases,
            unallocatedCaseCount: teamAllocations.caseCount,
          }
        })
        .sort((a, b) => a.teamName.localeCompare(b.teamName))
    }
    res.render('pages/allocate-cases-by-team', {
      title: 'Allocate cases by team | Manage a workforce',
      teams: caseInformationByTeam,
      pduCode,
    })
  }
}
