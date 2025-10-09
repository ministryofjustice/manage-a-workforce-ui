import { BooleanEvaluationResponse } from '@flipt-io/flipt-client-js'
import { createClient } from '../data/fliptClient'
import logger from '../../logger'

const fliptClient = createClient()

export default class FeatureFlagService {
  async isFeatureEnabled(code: string, flag: string): Promise<boolean> {
    try {
      const response = (await fliptClient).evaluateBoolean({
        entityId: code,
        flagKey: flag,
        context: {},
      }) as BooleanEvaluationResponse

      return response.enabled
    } catch (error) {
      logger.error(error, 'Feature flag not found for ')
      return false
    }
  }
}
