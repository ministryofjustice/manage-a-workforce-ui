import RestClient from '../data/restClient'
import { ApiConfig } from '../config'
import EstateTeam from '../models/EstateTeam'
import EstateRegion from '../models/EstateRegion'
import RegionDetails from '../models/RegionDetails'
import ProbationDeliveryUnitDetails from '../models/ProbationDeliveryUnitDetails'
import TeamDetails from '../models/TeamDetails'

export default class ProbationEstateService {
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('Probation Estate Service API Client', this.config, token)
  }

  async getProbationDeliveryUnitDetails(token: string, pduCode: string): Promise<ProbationDeliveryUnitDetails> {
    return (await this.restClient(token).get({
      path: `/probationDeliveryUnit/${pduCode}`,
      headers: { Accept: 'application/json' },
    })) as ProbationDeliveryUnitDetails
  }

  async getTeamsByCode(token: string, teamCodes: string[]): Promise<EstateTeam[]> {
    return (await this.restClient(token).get({
      path: `/team/search?codes=${teamCodes.join(',')}`,
      headers: { Accept: 'application/json' },
    })) as EstateTeam[]
  }

  async getTeamDetailsByCode(token: string, teamCode: string): Promise<TeamDetails> {
    return (await this.restClient(token).get({
      path: `/team/${teamCode}`,
      headers: { Accept: 'application/json' },
    })) as TeamDetails
  }

  async getRegions(token: string): Promise<EstateRegion[]> {
    return (await this.restClient(token).get({
      path: `/regions`,
      headers: { Accept: 'application/json' },
    })) as EstateRegion[]
  }

  async getRegionDetails(token: string, regionCode: string): Promise<RegionDetails> {
    return (await this.restClient(token).get({
      path: `/region/${regionCode}`,
      headers: { Accept: 'application/json' },
    })) as RegionDetails
  }
}
