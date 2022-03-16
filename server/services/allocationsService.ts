import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'
import Allocation from '../models/allocation'
import ProbationRecord from '../models/probationRecord'
import Risk from '../models/risk'
import AllocateOffenderManagers from '../models/allocateOffenderManagers'
import OffenderManagerPotentialWorkload from '../models/OffenderManagerPotentialWorkload'
import OffenderManagerOverview from '../models/offenderManagerOverview'
import FileDownload from '../models/fileDownload'

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

  async getUnallocatedCase(token: string, crn, convictionId): Promise<Allocation> {
    logger.info(`Getting unallocated case for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionId}`,
      headers: { Accept: 'application/json' },
    })) as Allocation
  }

  async getProbationRecord(token: string, crn, convictionId): Promise<ProbationRecord> {
    logger.info(`Getting probation record for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions?excludeConvictionId=${convictionId}`,
      headers: { Accept: 'application/json' },
    })) as ProbationRecord
  }

  async getRisk(token: string, crn, convictionId): Promise<Risk> {
    logger.info(`Getting risk for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionId}/risks`,
      headers: { Accept: 'application/json' },
    })) as Risk
  }

  async getOffenderManagersToAllocate(token: string, crn, convictionId): Promise<AllocateOffenderManagers> {
    logger.info(`Getting offender managers to allocate for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/${crn}/convictions/${convictionId}/allocate/offenderManagers`,
      headers: { Accept: 'application/json' },
    })) as AllocateOffenderManagers
  }

  async getCaseAllocationImpact(
    token: string,
    crn,
    offenderManagerCode,
    convictionId
  ): Promise<OffenderManagerPotentialWorkload> {
    logger.info(`Getting case allocation impact for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/${crn}/convictions/${convictionId}/allocate/${offenderManagerCode}/impact`,
      headers: { Accept: 'application/json' },
    })) as OffenderManagerPotentialWorkload
  }

  async getOffenderManagerOverview(
    token: string,
    crn,
    offenderManagerCode,
    convictionId
  ): Promise<OffenderManagerOverview> {
    logger.info(`Getting offender manager overview for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/${crn}/convictions/${convictionId}/allocate/${offenderManagerCode}/overview`,
      headers: { Accept: 'application/json' },
    })) as OffenderManagerOverview
  }

  async getDocument(token: string, crn, convictionId, documentId): Promise<FileDownload> {
    logger.info(`Getting document for crn ${crn}`)
    return this.restClient(token).stream({
      path: `/cases/unallocated/${crn}/convictions/${convictionId}/documents/${documentId}`,
    })
  }
}
