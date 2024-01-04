import config from '../config'
import RestClient from './restClient'

export interface User {
  name: string
  activeCaseLoadId: string
}

export default class ManageUsersClient {
  private static restClient(token: string): RestClient {
    return new RestClient('Manage Users API Client', config.apis.manageUsersService, token)
  }

  async getUser(token: string): Promise<User> {
    return ManageUsersClient.restClient(token).get({ path: '/users/me' }) as Promise<User>
  }
}
