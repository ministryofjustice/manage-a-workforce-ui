import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'
import Allocation from '../models/allocation'
import ProbationRecord from '../models/probationRecord'
import Risk from '../models/risk'
import AllocateOffenderManagers from '../models/allocateOffenderManagers'
import OffenderManagerPotentialWorkload from '../models/OffenderManagerPotentialWorkload'

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

  async getUnallocatedCase(token: string, crn): Promise<Allocation> {
    logger.info(`Getting unallocated case for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}`,
      headers: { Accept: 'application/json' },
    })) as Allocation
  }

  async getProbationRecord(token: string, crn): Promise<ProbationRecord> {
    logger.info(`Getting probation record for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions`,
      headers: { Accept: 'application/json' },
    })) as ProbationRecord
  }

  async getRisk(token: string, crn): Promise<Risk> {
    logger.info(`Getting risk for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/risks`,
      headers: { Accept: 'application/json' },
    })) as Risk
  }

  async getOffenderManagersToAllocate(token: string, crn): Promise<AllocateOffenderManagers> {
    logger.info(`Getting offender managers to allocate for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/${crn}/allocate/offenderManagers`,
      headers: { Accept: 'application/json' },
    })) as AllocateOffenderManagers
  }

  async getCaseAllocationImpact(token: string, crn, offenderManagerCode): Promise<OffenderManagerPotentialWorkload> {
    logger.info(`Getting case allocation impact for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/${crn}/allocate/${offenderManagerCode}/impact`,
      headers: { Accept: 'application/json' },
    })) as OffenderManagerPotentialWorkload
  }
}
