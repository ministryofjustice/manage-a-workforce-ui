import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'
import OffenderManagerPotentialWorkload from '../models/OffenderManagerPotentialWorkload'
import OffenderManagerCases from '../models/OffenderManagerCases'
import OffenderManagerOverview from '../models/OffenderManagerOverview'
import StaffSummary from '../models/StaffSummary'
import PersonManager from '../models/PersonManager'
import OffenderManagerAllocatedCase from '../models/OffenderManagerAllocatedCase'
import WorkloadByTeam from '../models/workloadByTeam'
import EventManagerDetails from '../models/EventManagerDetails'
import ChoosePractitionerData from '../models/ChoosePractitionerData'

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

  async getStaffByCode(token: string, staffCode): Promise<StaffSummary> {
    return (await this.restClient(token).get({
      path: `/staff/code/${staffCode}`,
    })) as StaffSummary
  }

  async getPersonById(token: string, personManagerId): Promise<PersonManager> {
    logger.info(`Getting person by ID ${personManagerId}`)
    return (await this.restClient(token).get({
      path: `/allocation/person/${personManagerId}`,
    })) as PersonManager
  }

  async allocateCaseToOffenderManager(
    token: string,
    crn,
    staffCode,
    convictionId,
    teamCode,
    instructions,
    emailTo,
    sendEmailCopyToAllocatingOfficer,
    eventNumber
  ): Promise<OffenderManagerAllocatedCase> {
    return (await this.restClient(token).post({
      path: `/team/${teamCode}/offenderManager/${staffCode}/case`,
      data: {
        crn,
        eventId: parseInt(convictionId, 10),
        instructions,
        emailTo,
        sendEmailCopyToAllocatingOfficer,
        eventNumber,
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
}
