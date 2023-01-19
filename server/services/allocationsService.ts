import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'
import Allocation from '../models/Allocation'
import ProbationRecord from '../models/ProbationRecord'
import Risk from '../models/Risk'
import FileDownload from '../models/FileDownload'
import UnallocatedCaseCountByTeam from '../models/UnallocatedCaseCountByTeam'
import DocumentDetails from '../models/DocumentDetails'
import UnallocatedCase from '../models/UnallocatedCase'
import CaseOverview from '../models/CaseOverview'

export default class AllocationsService {
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('Allocations Service API Client', this.config, token)
  }

  async getUnallocatedCasesByTeam(token: string, teamCode: string): Promise<UnallocatedCase[]> {
    return (await this.restClient(token).get({
      path: `/team/${teamCode}/cases/unallocated`,
    })) as UnallocatedCase[]
  }

  async getUnallocatedCase(token: string, crn, convictionNumber): Promise<Allocation> {
    logger.info(`Getting unallocated case for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionNumber}`,
    })) as Allocation
  }

  async getProbationRecord(token: string, crn, convictionNumber): Promise<ProbationRecord> {
    logger.info(`Getting probation record for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/record/exclude-conviction/${convictionNumber}`,
    })) as ProbationRecord
  }

  async getRisk(token: string, crn, convictionNumber): Promise<Risk> {
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionNumber}/risks`,
    })) as Risk
  }

  async getDocuments(token: string, crn: string): Promise<DocumentDetails[]> {
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/documents`,
    })) as DocumentDetails[]
  }

  async getCaseOverview(token: string, crn, convictionNumber): Promise<CaseOverview> {
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionNumber}/overview`,
    })) as CaseOverview
  }

  getDocument(token: string, crn, documentId): Promise<FileDownload> {
    logger.info(`Getting document for crn ${crn}`)
    return this.restClient(token).stream({
      path: `/cases/unallocated/${crn}/documents/${documentId}`,
    })
  }

  async getCaseCountByTeamCodes(token: string, teamCodes: string[]): Promise<UnallocatedCaseCountByTeam[]> {
    return (await this.restClient(token).get({
      path: `/cases/unallocated/teamCount?teams=${teamCodes.join(',')}`,
    })) as UnallocatedCaseCountByTeam[]
  }
}
