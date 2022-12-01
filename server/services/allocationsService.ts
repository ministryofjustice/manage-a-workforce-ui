import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'
import Allocation from '../models/Allocation'
import ProbationRecord from '../models/ProbationRecord'
import Risk from '../models/Risk'
import FileDownload from '../models/FileDownload'
import UnallocatedCaseCountByTeam from '../models/UnallocatedCaseCountByTeam'
import CaseForChoosePractitioner from '../models/CaseForChoosePractitioner'
import DocumentDetails from '../models/DocumentDetails'

export default class AllocationsService {
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('Allocations Service API Client', this.config, token)
  }

  async getUnallocatedCasesByTeam(token: string, teamCode: string): Promise<Allocation[]> {
    return (await this.restClient(token).get({
      path: `/team/${teamCode}/cases/unallocated`,
    })) as Allocation[]
  }

  async getUnallocatedCase(token: string, crn, convictionId): Promise<Allocation> {
    logger.info(`Getting unallocated case for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionId}`,
    })) as Allocation
  }

  async getProbationRecord(token: string, crn, convictionId): Promise<ProbationRecord> {
    logger.info(`Getting probation record for crn ${crn}`)
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions?excludeConvictionId=${convictionId}`,
    })) as ProbationRecord
  }

  async getRisk(token: string, crn, convictionId): Promise<Risk> {
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionId}/risks`,
    })) as Risk
  }

  async getDocuments(token: string, crn: string): Promise<DocumentDetails[]> {
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/documents`,
    })) as DocumentDetails[]
  }

  async getCaseOverview(token: string, crn, convictionId): Promise<Allocation> {
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionId}/overview`,
    })) as Allocation
  }

  async getCaseForChoosePractitioner(token: string, crn, convictionId): Promise<CaseForChoosePractitioner> {
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionId}/practitionerCase`,
    })) as CaseForChoosePractitioner
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
