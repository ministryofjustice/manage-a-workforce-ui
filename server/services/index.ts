import { dataAccess } from '../data'
import UserService from './userService'
import AllocationsService from './allocationsService'
import WorkloadService from './workloadService'
import ProbationEstateService from './probationEstateService'
import UserPreferenceService from './userPreferenceService'
import config from '../config'
import StaffLookupService from './staffLookupService'
import TechnicalUpdatesService from './technicalUpdatesService'
import CacheService from './cacheService'

export const services = () => {
  const { hmppsAuthClient } = dataAccess()

  const userService = new UserService(hmppsAuthClient)
  const allocationsService = new AllocationsService(config.apis.allocationsService)
  const workloadService = new WorkloadService(config.apis.workloadService)
  const probationEstateService = new ProbationEstateService(config.apis.probationEstateService)
  const userPreferenceService = new UserPreferenceService(config.apis.userPreferenceService)
  const staffLookupService = new StaffLookupService(config.apis.staffLookupService)
  const technicalUpdatesService = new TechnicalUpdatesService()
  const cacheService = new CacheService()
  return {
    userService,
    allocationsService,
    workloadService,
    probationEstateService,
    userPreferenceService,
    staffLookupService,
    technicalUpdatesService,
    cacheService,
  }
}

export type Services = ReturnType<typeof services>

export { UserService }
