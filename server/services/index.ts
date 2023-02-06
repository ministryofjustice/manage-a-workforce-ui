import { dataAccess } from '../data'
import UserService from './userService'
import AllocationsService from './allocationsService'
import WorkloadService from './workloadService'
import ProbationEstateService from './probationEstateService'
import UserPreferenceService from './userPreferenceService'
import config from '../config'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const allocationsService = new AllocationsService(config.apis.allocationsService)
  const workloadService = new WorkloadService(config.apis.workloadService)
  const probationEstateService = new ProbationEstateService(config.apis.probationEstateService)
  const userPreferenceService = new UserPreferenceService(config.apis.userPreferenceService)
  return {
    userService,
    allocationsService,
    workloadService,
    probationEstateService,
    userPreferenceService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
