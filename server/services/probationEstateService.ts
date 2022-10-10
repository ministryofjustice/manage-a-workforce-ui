import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'
import EstateTeam from '../models/EstateTeam'
import EstateRegion from '../models/EstateRegion'
import RegionDetails from '../models/RegionDetails'

export default class ProbationEstateService {
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('Probation Estate Service API Client', this.config, token)
  }

  async getProbationDeliveryUnitTeams(token: string, pduCode: string): Promise<EstateTeam[]> {
    logger.info(`Getting Teams for PDU ${pduCode}`)
    return (await this.restClient(token).get({
      path: `/probationDeliveryUnit/${pduCode}/teams`,
      headers: { Accept: 'application/json' },
    })) as EstateTeam[]
  }

  async getTeamsByCode(token: string, teamCodes: string[]): Promise<EstateTeam[]> {
    return (await this.restClient(token).get({
      path: `/team/search?codes=${teamCodes.join(',')}`,
      headers: { Accept: 'application/json' },
    })) as EstateTeam[]
  }

  async getTeamByCode(token: string, teamCode: string): Promise<EstateTeam> {
    return (await this.restClient(token).get({
      path: `/team/${teamCode}`,
      headers: { Accept: 'application/json' },
    })) as EstateTeam
  }

  async getRegions(token: string): Promise<EstateRegion[]> {
    return (await this.restClient(token).get({
      path: `/regions`,
      headers: { Accept: 'application/json' },
    })) as EstateRegion[]
  }

  async getRegionByCode(token: string, regionCode: string): Promise<RegionDetails> {
    return (await this.restClient(token).get({
      path: `/region/${regionCode}`,
      headers: { Accept: 'application/json' },
    })) as RegionDetails
  }
}
