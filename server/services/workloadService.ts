import { createClient } from 'redis'
import RestClient from '../data/restClient'
import { ApiConfig } from '../config'
import OffenderManagerPotentialWorkload from '../models/OffenderManagerPotentialWorkload'
import OffenderManagerCases from '../models/OffenderManagerCases'
import OffenderManagerOverview from '../models/OffenderManagerOverview'
import OffenderManagerAllocatedCase from '../models/OffenderManagerAllocatedCase'
import WorkloadByTeam from '../models/workloadByTeam'
import EventManagerDetails from '../models/EventManagerDetails'
import ChoosePractitionerData from '../models/ChoosePractitionerData'
import AllocationCompleteDetails from '../models/AllocationCompleteDetails'
import AllocationHistory from '../models/AllocationHistory'
import AllocationHistoryCount from '../models/AllocationHistoryCount'
import { createRedisClient } from '../data/redisClient'

export default class WorkloadService {
  config: ApiConfig

  redisClient: ReturnType<typeof createClient>

  constructor(config: ApiConfig) {
    this.config = config
    this.initializeRedisClient()
  }

  private async initializeRedisClient() {
    this.redisClient = await createRedisClient().connect()
  }

  private restClient(token: string): RestClient {
    return new RestClient('Workload Service API Client', this.config, token)
  }

  private async checkRedisCache(
    crn: string,
    staffCode: string,
    teamCode: string,
    eventNumber: number,
  ): Promise<boolean> {
    const cacheKey = `allocation:${crn}:${staffCode}:${teamCode}:${eventNumber}`
    const cachedValue = await this.redisClient.get(cacheKey)
    if (cachedValue) {
      return false
    }
    await this.redisClient.set(cacheKey, 'true', { EX: 60 })
    return true
  }

  async getChoosePractitionerData(token: string, crn: string, teamCodes: string[]): Promise<ChoosePractitionerData> {
    return (await this.restClient(token).get({
      path: `/team/choose-practitioner?grades=PSO,PQiP,PO&crn=${crn}&teamCodes=${teamCodes.join(',')}`,
    })) as ChoosePractitionerData
  }

  async getCaseAllocationImpact(token: string, crn, staffCode, teamCode): Promise<OffenderManagerPotentialWorkload> {
    return (await this.restClient(token).get({
      path: `/team/${teamCode}/offenderManager/${staffCode}/impact/person/${crn}`,
    })) as OffenderManagerPotentialWorkload
  }

  async getOffenderManagerCases(token: string, offenderManagerCode, teamCode: string): Promise<OffenderManagerCases> {
    return (await this.restClient(token).get({
      path: `/team/${teamCode}/offenderManagers/${offenderManagerCode}/cases`,
    })) as OffenderManagerCases
  }

  async getOffenderManagerOverview(
    token: string,
    offenderManagerCode,
    teamCode: string,
  ): Promise<OffenderManagerOverview> {
    return (await this.restClient(token).get({
      path: `/team/${teamCode}/offenderManagers/${offenderManagerCode}`,
    })) as OffenderManagerOverview
  }

  async sendComparisionLogToWorkload(
    notesEdited: boolean,
    editNotesScreenAccessed: boolean,
    crn: string,
    teamCode: string,
    token: string,
  ) {
    await this.restClient(token).post({
      path: `/allocations/contact/logging`,
      data: {
        crn,
        teamCode,
        editNotesScreenAccessed,
        notesEdited,
      },
    })
  }

  async allocateCaseToOffenderManager(
    token: string,
    crn,
    staffCode,
    teamCode,
    emailTo,
    sendEmailCopyToAllocatingOfficer,
    eventNumber: number,
    spoOversightNotes: string,
    sensitiveOversightNotes: boolean,
    allocationJustificationNotes: string,
    sensitiveNotes: boolean,
    isSPOOversightAccessed: string,
    laoCase: boolean,
  ): Promise<OffenderManagerAllocatedCase> {
    await this.sendComparisionLogToWorkload(
      spoOversightNotes !== allocationJustificationNotes,
      isSPOOversightAccessed === 'true',
      crn,
      teamCode,
      token,
    )

    const allocationData = {
      crn,
      instructions: '',
      emailTo,
      sendEmailCopyToAllocatingOfficer,
      eventNumber,
      allocationJustificationNotes,
      sensitiveNotes,
      spoOversightNotes,
      sensitiveOversightNotes,
      laoCase,
    }

    const canPost = await this.checkRedisCache(crn, staffCode, teamCode, eventNumber)
    if (!canPost) {
      const emptyCase: OffenderManagerAllocatedCase = {
        personManagerId: '',
        eventManagerId: '',
        requirementManagerIds: [],
      }
      return emptyCase
    }
    return (await this.restClient(token).post({
      path: `/team/${teamCode}/offenderManager/${staffCode}/case`,
      data: allocationData,
    })) as OffenderManagerAllocatedCase
  }

  async getWorkloadByTeams(token: string, teamCodes: string[]): Promise<WorkloadByTeam[]> {
    return (await this.restClient(token).get({
      path: `/team/workloadcases?teams=${teamCodes.join(',')}`,
    })) as WorkloadByTeam[]
  }

  async getEventManagerDetails(token: string, crn, convictionNumber): Promise<EventManagerDetails> {
    return (await this.restClient(token).get({
      path: `/allocation/person/${crn}/event/${convictionNumber}/details`,
    })) as EventManagerDetails
  }

  async getAllocationCompleteDetails(token: string, crn, convictionNumber): Promise<AllocationCompleteDetails> {
    return (await this.restClient(token).get({
      path: `/allocation/person/${crn}/event/${convictionNumber}/complete-details`,
    })) as AllocationCompleteDetails
  }

  async getAllocationHistory(token: string, sinceDate: string): Promise<AllocationHistory> {
    return (await this.restClient(token).get({
      path: `/allocation/events/me?since=${sinceDate}`,
    })) as AllocationHistory
  }

  async getAllocationHistoryCount(token: string, sinceDate: string): Promise<AllocationHistoryCount> {
    return (await this.restClient(token).get({
      path: `/allocation/events/me/count?since=${sinceDate}`,
    })) as AllocationHistoryCount
  }

  async postAllocationHistory(token: string, sinceDate: string, teams: string[]): Promise<AllocationHistory> {
    return (await this.restClient(token).post({
      path: `/allocation/events/teams?since=${sinceDate}`,
      data: {
        teams,
      },
    })) as AllocationHistory
  }

  async postAllocationHistoryCount(token: string, sinceDate: string, teams: string[]): Promise<AllocationHistoryCount> {
    return (await this.restClient(token).post({
      path: `/allocation/events/teams/count?since=${sinceDate}`,
      data: {
        teams,
      },
    })) as AllocationHistoryCount
  }

  async getTeamWorkload(token: string, teamCode: string) {
    return this.restClient(token).get({
      path: `/team/practitioner-workloadcases?teamCode=${teamCode}`,
    })
  }
}
