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

  async getTeamsUserPreference(username: string, token: string): Promise<UserPreference> {
    return (await this.restClient(token).get({
      path: `/users/${username}/preferences/allocation-teams`,
      headers: { Accept: 'application/json' },
    })) as UserPreference
  }
}
