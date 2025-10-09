import { BooleanEvaluationResponse } from '@flipt-io/flipt-client-js'
import { createClient } from '../data/fliptClient'
import logger from '../../logger'

const fliptClient = createClient()

export default class FeatureFlagService {
  async isFeatureEnabled(key: string): Promise<boolean> {
    return this.isFeatureEnabledContext(key, null)
  }

  async isFeatureEnabledContext(key: string, context: Record<string, string>): Promise<boolean> {
    try {
      const response = (await fliptClient).evaluateBoolean({
        entityId: key,
        flagKey: key,
        context,
      }) as BooleanEvaluationResponse

      return response.enabled
    } catch (error) {
      logger.error(error, 'Failed to retrieve unallocated case count')
      return false
    }
  }
}
