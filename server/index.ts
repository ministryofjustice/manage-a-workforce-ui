import createApp from './app'
import HmppsAuthClient from './data/hmppsAuthClient'
import UserService from './services/userService'
import config from './config'
import AllocationsService from './services/allocationsService'

const hmppsAuthClient = new HmppsAuthClient()
const userService = new UserService(hmppsAuthClient)
const allocationsService = new AllocationsService(config.apis.allocationsService)

const app = createApp(userService, allocationsService)

export default app
