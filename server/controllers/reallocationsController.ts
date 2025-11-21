import AllocationsService from '../services/allocationsService'
import FeatureFlagService from '../services/featureFlagService'
import ProbationEstateService from '../services/probationEstateService'
import UserPreferenceService from '../services/userPreferenceService'
import WorkloadService from '../services/workloadService'

export default class ReallocationsController {
  constructor(
    private readonly allocationsService: AllocationsService,
    private readonly workloadService: WorkloadService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly probationEstateService: ProbationEstateService,
    private readonly featureFlagService: FeatureFlagService,
  ) {}

  async getSearch(req, res, pduCode: string) {
    const reallocationEnabledFlag = await this.featureFlagService.isFeatureEnabled('Reallocations', 'Reallocations')

    if (!reallocationEnabledFlag) {
      res.redirect(`/pdu/${pduCode}/teams`)
      return
    }

    const { search } = req.query
    const { token, username } = res.locals.user
    const [teamsUserPreference, probationDeliveryUnitDetails] = await Promise.all([
      this.userPreferenceService.getTeamsUserPreference(token, username),
      this.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode),
    ])

    let searchData
    let error: boolean = false

    if (search) {
      try {
        searchData = await this.allocationsService.getCrnForReallocation(search.toUpperCase(), token)
      } catch {
        error = true
      }
    }

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

    res.render('pages/reallocations/search', {
      search,
      searchData,
      pduCode,
      teams: caseInformationByTeam,
      pduName: probationDeliveryUnitDetails.name,
      regionName: probationDeliveryUnitDetails.region.name,
      error,
      title: 'Reallocations | Manage a Workforce',
      journey: 'reallocations',
    })
  }
}
