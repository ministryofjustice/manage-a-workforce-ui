import { BooleanEvaluationResponse, VariantEvaluationResponse } from '@flipt-io/flipt-client-js'
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
      logger.error(error, `Feature flag not found for ${flag} /${code}`)
      return false
    }
  }

  async isFeatureEnabledWithContext(code: string, flag: string, context: string): Promise<boolean> {
    try {
      const response = (await fliptClient).evaluateBoolean({
        entityId: code,
        flagKey: flag,
        context: {
          code: context,
        },
      }) as BooleanEvaluationResponse

      return response.enabled
    } catch (error) {
      logger.error(error, `Feature flag not found for ${flag} /${code}`)
      return false
    }
  }

  async getFeatureVariantWithContext(code: string, flag: string, context: string): Promise<boolean> {
    try {
      const response = (await fliptClient).evaluateVariant({
        entityId: code,
        flagKey: flag,
        context: {
          code: context,
        },
      }) as VariantEvaluationResponse

      return response.match
    } catch (error) {
      logger.error(error, `Feature flag not found for ${flag} /${code}`)
      return false
    }
  }

  async getFeatureVariant(code: string, flag: string): Promise<boolean> {
    try {
      const response = (await fliptClient).evaluateVariant({
        entityId: code,
        flagKey: flag,
        context: {},
      }) as VariantEvaluationResponse

      return response.match
    } catch (error) {
      logger.error(error, `Feature flag not found for ${flag} /${code}`)
      return false
    }
  }
}
