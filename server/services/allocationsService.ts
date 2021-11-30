import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'

export interface Allocation {
  name: string
  crn: string
  tier: string
  sentenceDate: string
  initialAppointment: string
  status: string
  previousConvictionEndDate: string
}

export default class AllocationsService {
  constructor(private readonly config: ApiConfig) {}

  private restClient(token: string): RestClient {
    return new RestClient('Allocations Service API Client', this.config, token)
  }

  async getUnallocatedCases(token: string): Promise<Allocation[]> {
    logger.info(`Getting unallocated cases`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated`,
      headers: { Accept: 'application/json' },
    })) as Allocation[]
  }
}
