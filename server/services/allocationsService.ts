import { createClient } from 'redis'
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
import PersonOnProbationStaffDetails from '../models/PersonOnProbationStaffDetails'
import CrnStaffRestrictions from '../models/CrnStaffRestrictions'
import AllocationLAOStatus from '../models/AllocationLAOStatus'
import LaoStatusList from '../models/LaoStatusList'
import RegionList from '../models/RegionList'
import { createRedisClient } from '../data/redisClient'
import CrnDetails from '../models/ReallocationCrnDetails'

interface CachedValue {
  instructions?: string
  isSensitive?: boolean
  emailCopyOptOut?: boolean
  person?: { email: string }[]
  sendEmailCopyToAllocatingOfficer?: boolean
  spoOversightContact?: string
  spoOversightSensitive?: boolean
}
export default class AllocationsService {
  config: ApiConfig

  redisClient: ReturnType<typeof createClient>

  constructor(config: ApiConfig) {
    this.config = config
    this.initializeRedisClient()
  }

  private async initializeRedisClient() {
    this.redisClient = await createRedisClient().connect()
  }

  async getNotesCache(crn: string, convictionNumber: string, staffCode: string): Promise<CachedValue> {
    const cacheKey = `allocation_notes:${crn}:${convictionNumber}:${staffCode}`
    const cachedValue = await this.redisClient.json.get(cacheKey)
    return (cachedValue ?? {}) as CachedValue
  }

  async setNotesCache(crn: string, convictionNumber: string, staffCode: string, value: CachedValue): Promise<void> {
    const cachedValue = await this.getNotesCache(crn, convictionNumber, staffCode)

    const cacheKey = `allocation_notes:${crn}:${convictionNumber}:${staffCode}`
    await this.redisClient.json.set(cacheKey, '$', {
      ...cachedValue,
      ...value,
    })

    await this.redisClient.expire(cacheKey, 60 * 60 * 24 * 7)
  }

  async clearNotesCache(crn: string, convictionNumber: string, staffCode: string) {
    const cacheKey = `allocation_notes:${crn}:${convictionNumber}:${staffCode}`
    await this.redisClient.del(cacheKey)
  }

  async getLaoStatus(crn: string, token: string): Promise<boolean> {
    return (await this.restClient(token).get({ path: `/cases/unallocated/${crn}/restricted` })) as boolean
  }

  async getRestrictedStatusByCrnAndStaffCodes(
    token: string,
    crn: string,
    staffCodes: string[],
  ): Promise<CrnStaffRestrictions> {
    return (await this.restClient(token).post({
      path: `/cases/unallocated/${crn}/restrictions`,
      data: {
        staffCodes,
      },
    })) as CrnStaffRestrictions
  }

  async getRestrictedStatusByCrns(token: string, crns: string[]): Promise<LaoStatusList> {
    return (await this.restClient(token).post({
      path: `/cases/restrictions/crn/list`,
      data: {
        crns,
      },
    })) as LaoStatusList
  }

  async getRegionsForUser(token: string, staffId: string): Promise<RegionList> {
    return (await this.restClient(token).get({
      path: `/user/${staffId}/regions`,
    })) as RegionList
  }

  async getUserRegionAccessForCrn(
    token: string,
    staffId: string,
    crn: string,
    convictionNumber: string,
  ): Promise<string> {
    return (await this.restClient(token).get({
      path: `/user/${staffId}/crn/${crn}/conviction/${convictionNumber}/is-allowed`,
    })) as string
  }

  async getUserRegionAccessForRegion(token: string, staffId: string, region: string): Promise<string> {
    return (await this.restClient(token).get({
      path: `/user/${staffId}/region/${region}/is-allowed`,
    })) as string
  }

  async getCrn(token: string, crn: string): Promise<string> {
    return (await this.restClient(token).get({
      path: `/allocated/crn/${crn}`,
    })) as string
  }

  async getUserRegionAccessForPdu(token: string, staffId: string, pdu: string): Promise<string> {
    return (await this.restClient(token).get({
      path: `/user/${staffId}/pdu/${pdu}/is-allowed`,
    })) as string
  }

  async getLAOStatusforAllocation(token: string, crn: string): Promise<AllocationLAOStatus> {
    return (await this.restClient(token).get({
      path: `/cases/${crn}/restrictions`,
    })) as AllocationLAOStatus
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

  async getConfirmInstructions(
    token: string,
    crn,
    convictionNumber,
    staffCode,
  ): Promise<PersonOnProbationStaffDetails> {
    return (await this.restClient(token).get({
      path: `/cases/unallocated/${crn}/convictions/${convictionNumber}/confirm-instructions?staffCode=${staffCode}`,
    })) as PersonOnProbationStaffDetails
  }

  async getLookupforCrn(crn: string, token: string): Promise<CrnDetails[]> {
    return (await this.restClient(token).get({ path: `/allocated/crn/${crn}` })) as CrnDetails[]
  }

  async getCrnForReallocation(crn: string, token: string): Promise<CrnDetails> {
    return (await this.restClient(token)
      .get({ path: `/allocated/crn/${crn}` })
      .catch(() => {
        throw new Error('Invalid CRN')
      })) as CrnDetails
  }
}
