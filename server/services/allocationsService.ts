import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'
import Allocation from '../models/Allocation'
import ProbationRecord from '../models/ProbationRecord'
import Risk from '../models/Risk'
import FileDownload from '../models/FileDownload'
import UnallocatedCaseCountByTeam from '../models/UnallocatedCaseCountByTeam'

export default class AllocationsService {
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('Allocations Service API Client', this.config, token)
  }

  async getUnallocatedCasesByTeam(token: string, teamCode: string): Promise<Allocation[]> {
    logger.info(`Getting unallocated cases by team`)
    return (await this.restClient(token).get({
      path: `/team/${teamCode}/cases/unallocated`,
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

  async getCaseOverview(token: string, crn, convictionId): Promise<Allocation> {
    logger.info(`Getting case overview for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionId}/overview`,
      headers: { Accept: 'application/json' },
    })) as Allocation
  }

  getDocument(token: string, crn, convictionId, documentId): Promise<FileDownload> {
    logger.info(`Getting document for crn ${crn}`)
    return this.restClient(token).stream({
      path: `/cases/unallocated/${crn}/convictions/${convictionId}/documents/${documentId}`,
    })
  }

  async getCaseCountByTeamCodes(token: string, teamCodes: string[]): Promise<UnallocatedCaseCountByTeam[]> {
    return (await this.restClient(token).get({
      path: `/cases/unallocated/teamCount?teams=${teamCodes.join(',')}`,
      headers: { Accept: 'application/json' },
    })) as UnallocatedCaseCountByTeam[]
  }
}
