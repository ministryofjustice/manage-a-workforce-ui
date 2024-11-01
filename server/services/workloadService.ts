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

export default class WorkloadService {
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('Workload Service API Client', this.config, token)
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
    teamCode: string
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
    token: string
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
    laoCase: boolean
  ): Promise<OffenderManagerAllocatedCase> {
    await this.sendComparisionLogToWorkload(
      spoOversightNotes !== allocationJustificationNotes,
      isSPOOversightAccessed === 'true',
      crn,
      teamCode,
      token
    )

    return (await this.restClient(token).post({
      path: `/team/${teamCode}/offenderManager/${staffCode}/case`,
      data: {
        crn,
        instructions: '',
        emailTo,
        sendEmailCopyToAllocatingOfficer,
        eventNumber,
        allocationJustificationNotes,
        sensitiveNotes,
        spoOversightNotes,
        sensitiveOversightNotes,
      },
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
}
