import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'
import AllocateOffenderManagers from '../models/allocateOffenderManagers'
import OffenderManagerPotentialWorkload from '../models/OffenderManagerPotentialWorkload'
import OffenderManagerCases from '../models/offenderManagerCases'
import OffenderManagerOverview from '../models/offenderManagerOverview'
import StaffSummary from '../models/StaffSummary'
import OffenderManagerAllocatedCase from '../models/OffenderManagerAllocatedCase'

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
      query: 'grades=PSO,PQiP,PO',
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

  async getOffenderManagerCases(token: string, offenderManagerCode): Promise<OffenderManagerCases> {
    logger.info(`Getting active cases for team N03F01 and offender manager ${offenderManagerCode}`)
    return (await this.restClient(token).get({
      path: `/team/N03F01/offenderManagers/${offenderManagerCode}/cases`,
      headers: { Accept: 'application/json' },
    })) as OffenderManagerCases
  }

  async getOffenderManagerOverview(token: string, offenderManagerCode): Promise<OffenderManagerOverview> {
    logger.info(`Getting overview for team N03F01 and offender manager ${offenderManagerCode}`)
    return (await this.restClient(token).get({
      path: `/team/N03F01/offenderManagers/${offenderManagerCode}`,
      headers: { Accept: 'application/json' },
    })) as OffenderManagerOverview
  }

  async getStaffById(token: string, staffId): Promise<StaffSummary> {
    logger.info(`Getting staff by ID ${staffId}`)
    return (await this.restClient(token).get({
      path: `/staff/${staffId}`,
      headers: { Accept: 'application/json' },
    })) as StaffSummary
  }

  async allocateCaseToOffenderManager(
    token: string,
    crn,
    staffId,
    convictionId,
    instructions,
    emailTo
  ): Promise<OffenderManagerAllocatedCase> {
    logger.info(`Allocating case with crn ${crn} for team N03F01 and staff id ${staffId}`)
    return (await this.restClient(token).post({
      path: `/team/N03F01/offenderManagers/${staffId}/cases`,
      data: {
        crn,
        eventId: parseInt(convictionId, 10),
        instructions,
        emailTo,
      },
      headers: { Accept: 'application/json' },
    })) as OffenderManagerAllocatedCase
  }
}
