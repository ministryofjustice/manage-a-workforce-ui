import RestClient from '../data/restClient'
import { ApiConfig } from '../config'
import StaffLookupItem from '../models/StaffLookupItem'

export default class StaffLookupService {
  config: ApiConfig

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('Staff Search Service API Client', this.config, token)
  }

  async lookup(token: string, searchString: string): Promise<StaffLookupItem[]> {
    return (await this.restClient(token).get({
      path: `/staff/search?email=${searchString}`,
    })) as StaffLookupItem[]
  }
}
