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
    const [teamsUserPreference, probationDeliveryUnitDetails] = await Promise.all([
      this.userPreferenceService.getTeamsUserPreference(token, username),
      this.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode),
    ])
    const teamCodes = teamsUserPreference.items
    let caseInformationByTeam = []
    if (teamCodes.length) {
      const [workloadByTeam, probationEstateTeams] = await Promise.all([
        this.workloadService.getWorkloadByTeams(token, teamCodes),
        this.probationEstateService.getTeamsByCode(token, teamCodes),
      ])
      caseInformationByTeam = probationEstateTeams
        .map(team => {
          const teamWorkload = workloadByTeam.find(w => w.teamCode === team.code) ?? {
            totalCases: '-',
            workload: '-',
          }

          return {
            teamCode: team.code,
            teamName: team.name,
            workload: `${teamWorkload.workload}%`,
            caseCount: teamWorkload.totalCases,
          }
        })
        .sort((a, b) => a.teamName.localeCompare(b.teamName))
    }
    res.render('pages/allocate-cases-by-team', {
      title: 'Allocate cases by team | Manage a workforce',
      teams: caseInformationByTeam,
      pduCode,
      pduName: probationDeliveryUnitDetails.name,
      regionName: probationDeliveryUnitDetails.region.name,
    })
  }

  async getTeamWorkload(_req: Request, res: Response, pduCode: string, teamCode: string) {
    const { token } = res.locals.user

    const teamDetails = await this.probationEstateService.getTeamDetails(token, teamCode)
    const teamWorkload = await this.workloadService.getTeamWorkload(token, teamCode)
    const teamWorkloadData = await this.workloadService.getWorkloadByTeams(token, [teamCode])

    let totalCases = 0

    teamWorkload[teamCode].teams.forEach(team => {
      totalCases += team.custodyCases
      totalCases += team.communityCases
    })

    const workload = teamWorkload[teamCode].teams.map(team => ({ ...team, gradeOrder: setGradeOrder(team.grade) }))
    workload.sort(sortPractitionersByGrade)

    res.render('pages/team-workload', {
      title: 'Team Workload | Manage a workforce',
      teamDetails,
      teamCode,
      pduCode,
      teamWorkload: workload,
      totalCases,
      averageWorkload: teamWorkloadData[0].workload,
    })
  }
}

function sortPractitionersByGrade(a, b) {
  if (b.gradeOrder === a.gradeOrder) {
    return a.workload - b.workload
  }
  return a.gradeOrder - b.gradeOrder
}

function setGradeOrder(grade) {
  const order = {
    PO: 3,
    PSO: 2,
    PQiP: 1,
  }
  return order[grade] || 0
}
