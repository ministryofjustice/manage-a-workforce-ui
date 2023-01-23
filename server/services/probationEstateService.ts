import RestClient from '../data/restClient'
import { ApiConfig } from '../config'
import EstateTeam from '../models/EstateTeam'
import EstateRegion from '../models/EstateRegion'
import RegionDetails from '../models/RegionDetails'
import ProbationDeliveryUnitDetails from '../models/ProbationDeliveryUnitDetails'
import AllProbationDeliveryUnit from '../models/AllProbationDeliveryUnit'

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
    })) as ProbationDeliveryUnitDetails
  }

  async getTeamsByCode(token: string, teamCodes: string[]): Promise<EstateTeam[]> {
    return (await this.restClient(token).get({
      path: `/team/search?codes=${teamCodes.join(',')}`,
    })) as EstateTeam[]
  }

  async getRegions(token: string): Promise<EstateRegion[]> {
    return (await this.restClient(token).get({
      path: `/regions`,
    })) as EstateRegion[]
  }

  async getRegionDetails(token: string, regionCode: string): Promise<RegionDetails> {
    return (await this.restClient(token).get({
      path: `/region/${regionCode}`,
    })) as RegionDetails
  }

  async getAllEstateByRegionCode(token: string, regionCode: string): Promise<Map<string, AllProbationDeliveryUnit>> {
    return (await this.restClient(token).get({
      path: `/all/region/${regionCode}`,
    })) as Map<string, AllProbationDeliveryUnit>
  }
}
