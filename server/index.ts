import { Application } from 'express'
import configureApplication from './app'
import HmppsAuthClient from './data/hmppsAuthClient'
import { createRedisClient } from './data/redisClient'
import TokenStore from './data/tokenStore'
import UserService from './services/userService'
import AllocationsService from './services/allocationsService'
import WorkloadService from './services/workloadService'
import config from './config'
import ProbationEstateService from './services/probationEstateService'

export default async function createApplication(): Promise<Application> {
  const hmppsAuthClient = new HmppsAuthClient(new TokenStore(createRedisClient({ legacyMode: false })))
  const userService = new UserService(hmppsAuthClient)
  const allocationsService = new AllocationsService(config.apis.allocationsService)
  const workloadService = new WorkloadService(config.apis.workloadService)
  const probationEstateService = new ProbationEstateService(config.apis.probationEstateService)
  return configureApplication(userService, allocationsService, workloadService, probationEstateService)
}
