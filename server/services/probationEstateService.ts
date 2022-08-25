import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'
import EstateTeam from '../models/EstateTeam'

export default class ProbationEstateService {
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('Probation Estate Service API Client', this.config, token)
  }

  async getProbationDeliveryUnitTeams(pduCode: string, token: string): Promise<EstateTeam[]> {
    logger.info(`Getting Teams for PDU ${pduCode}`)
    return (await this.restClient(token).get({
      path: `/probationDeliveryUnit/${pduCode}/teams`,
      headers: { Accept: 'application/json' },
    })) as EstateTeam[]
  }
}
