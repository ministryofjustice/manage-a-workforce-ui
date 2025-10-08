import RestClient from '../data/restClient'
import { ApiConfig } from '../config'
import FeatureFlagResponse from '../models/FeatureFlagResponse'

export default class FeatureFlagService {
  config: ApiConfig

  async getFeatureFlag(key: string, token: string): Promise<boolean> {
    return this.getFeatureFlagWithContext(key, token, null)
  }

  async getFeatureFlagWithContext(key: string, token: string, context: Map<string, string>): Promise<boolean> {
    const fliptNamespace = 'ManageAWorkforce'

    const result = (await this.restClient(token).post({
      path: `/ap1/v1/evaluate`,
      data: {
        context,
        entityId: key,
        flagKey: key,
        namespace: fliptNamespace,
      },
    })) as FeatureFlagResponse

    return result.enabled
  }

  constructor(config: ApiConfig) {
    this.config = config
  }

  private restClient(token: string): RestClient {
    return new RestClient('Feature Flag Service API Client', this.config, token)
  }
}
