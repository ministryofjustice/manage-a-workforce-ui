import RestClient from '../data/restClient'
import logger from '../../logger'
import { ApiConfig } from '../config'
import AllocateOffenderManagers from '../models/AllocateOffenderManagers'
import OffenderManagerPotentialWorkload from '../models/OffenderManagerPotentialWorkload'
import OffenderManagerCases from '../models/OffenderManagerCases'
import OffenderManagerOverview from '../models/OffenderManagerOverview'
import StaffSummary from '../models/StaffSummary'
import PersonManager from '../models/PersonManager'
import OffenderManagerAllocatedCase from '../models/OffenderManagerAllocatedCase'
import WorkloadByTeam from '../models/workloadByTeam'

export default class WorkloadService {
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('Workload Service API Client', this.config, token)
  }

  async getOffenderManagersToAllocate(token: string, teamCode: string): Promise<AllocateOffenderManagers> {
    return (await this.restClient(token).get({
      path: `/team/${teamCode}/offenderManagers`,
      query: 'grades=PSO,PQiP,PO',
      headers: { Accept: 'application/json' },
    })) as AllocateOffenderManagers
  }

  async getCaseAllocationImpact(
    token: string,
    crn,
    staffCode,
    convictionId
  ): Promise<OffenderManagerPotentialWorkload> {
    return (await this.restClient(token).post({
      path: `/team/N03F01/offenderManager/${staffCode}/impact`,
      data: {
        crn,
        convictionId: parseInt(convictionId, 10),
      },
      headers: { Accept: 'application/json' },
    })) as OffenderManagerPotentialWorkload
  }

  async getOffenderManagerCases(token: string, offenderManagerCode, teamCode: string): Promise<OffenderManagerCases> {
    return (await this.restClient(token).get({
      path: `/team/${teamCode}/offenderManagers/${offenderManagerCode}/cases`,
      headers: { Accept: 'application/json' },
    })) as OffenderManagerCases
  }

  async getOffenderManagerOverview(
    token: string,
    offenderManagerCode,
    teamCode: string
  ): Promise<OffenderManagerOverview> {
    return (await this.restClient(token).get({
      path: `/team/${teamCode}/offenderManagers/${offenderManagerCode}`,
      headers: { Accept: 'application/json' },
    })) as OffenderManagerOverview
  }

  async getStaffByCode(token: string, staffCode): Promise<StaffSummary> {
    return (await this.restClient(token).get({
      path: `/staff/code/${staffCode}`,
      headers: { Accept: 'application/json' },
    })) as StaffSummary
  }

  async getPersonById(token: string, personManagerId): Promise<PersonManager> {
    logger.info(`Getting person by ID ${personManagerId}`)
    return (await this.restClient(token).get({
      path: `/allocation/person/${personManagerId}`,
      headers: { Accept: 'application/json' },
    })) as PersonManager
  }

  async allocateCaseToOffenderManager(
    token: string,
    crn,
    staffCode,
    convictionId,
    instructions,
    emailTo
  ): Promise<OffenderManagerAllocatedCase> {
    return (await this.restClient(token).post({
      path: `/team/N03F01/offenderManager/${staffCode}/case`,
      data: {
        crn,
        eventId: parseInt(convictionId, 10),
        instructions,
        emailTo,
      },
      headers: { Accept: 'application/json' },
    })) as OffenderManagerAllocatedCase
  }

  async getWorkloadByTeams(token: string, teamCodes: string[]): Promise<WorkloadByTeam[]> {
    return (await this.restClient(token).get({
      path: `/team/workloadcases?teams=${teamCodes.join(',')}`,
      headers: { Accept: 'application/json' },
    })) as WorkloadByTeam[]
  }
}
