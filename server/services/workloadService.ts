import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'
import AllocateOffenderManagers from '../models/allocateOffenderManagers'
import OffenderManagerPotentialWorkload from '../models/OffenderManagerPotentialWorkload'

export default class WorkloadService {
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('Allocations Service API Client', this.config, token)
  }

  async getOffenderManagersToAllocate(token: string): Promise<AllocateOffenderManagers> {
    logger.info(`Getting offender managers to allocate for team N03F01`)
    return (await this.restClient(token).get({
      path: `/team/N03F01/offenderManagers`,
      headers: { Accept: 'application/json' },
    })) as AllocateOffenderManagers
  }

  async getCaseAllocationImpact(token: string, crn, staffId, convictionId): Promise<OffenderManagerPotentialWorkload> {
    logger.info(`Getting impact for team N03F01 and staff id ${staffId}`)
    return (await this.restClient(token).post({
      path: `/team/N03F01/offenderManagers/${staffId}/impact`,
      data: {
        crn,
        convictionId: parseInt(convictionId, 10),
      },
      headers: { Accept: 'application/json' },
    })) as OffenderManagerPotentialWorkload
  }
}
