import config from '../config'
import RestClient from './restClient'

export interface User {
  name: string
  activeCaseLoadId: string
}

export interface UserRole {
  roleCode: string
}

export default class HmppsAuthClient {
  private static restClient(token: string): RestClient {
    return new RestClient('HMPPS Auth Client', config.apis.hmppsAuth, token)
  }

  async getUser(token: string): Promise<User> {
    return HmppsAuthClient.restClient(token).get({ path: '/api/user/me' }) as Promise<User>
  }
}
