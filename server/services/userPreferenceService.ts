import RestClient from '../data/restClient'
import { ApiConfig } from '../config'
import UserPreference from '../models/UserPreference'

export default class UserPreferenceService {
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('User Preference Service API Client', this.config, token)
  }

  async getTeamsUserPreference(token: string, username: string): Promise<UserPreference> {
    return (await this.restClient(token).get({
      path: `/users/${username}/preferences/allocation-teams`,
    })) as UserPreference
  }

  async saveTeamsUserPreference(token: string, username: string, items: string[]): Promise<UserPreference> {
    return (await this.restClient(token).put({
      path: `/users/${username}/preferences/allocation-teams`,
      data: {
        items,
      },
    })) as UserPreference
  }

  async savePduUserPreference(token: string, username: string, pduCode: string): Promise<UserPreference> {
    return (await this.restClient(token).put({
      path: `/users/${username}/preferences/allocation-pdu`,

      data: {
        items: [pduCode],
      },
    })) as UserPreference
  }

  async getPduUserPreference(token: string, username: string): Promise<UserPreference> {
    return (await this.restClient(token).get({
      path: `/users/${username}/preferences/allocation-pdu`,
    })) as UserPreference
  }
}
