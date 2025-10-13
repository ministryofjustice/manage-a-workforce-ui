import { BooleanEvaluationResponse, FliptClient, VariantEvaluationResponse } from '@flipt-io/flipt-client-js'
import logger from '../../logger'
import config from '../config'

export default class FeatureFlagService {
  client: FliptClient

  async fliptClient(): Promise<FliptClient> {
    if (!this.client) {
      this.client = await FliptClient.init({
        namespace: config.fliptClient.namespace,
        url: config.fliptClient.url,
        updateInterval: config.fliptClient.timeout.response,
        authentication: {
          clientToken: config.fliptClient.apiClientSecret,
        },
      }).catch(error => {
        logger.error(error, `Unable to connect to feature flag service`)
        throw Error(`Unable to connect to feature flag service`)
      })
    }

    return this.client
  }

  async isFeatureEnabled(code: string, flag: string): Promise<boolean> {
    try {
      const response = (await this.fliptClient()).evaluateBoolean({
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

  async isFeatureEnabledWithContext(code: string, flag: string, context: Record<string, string>): Promise<boolean> {
    try {
      const response = (await this.fliptClient()).evaluateBoolean({
        entityId: code,
        flagKey: flag,
        context,
      }) as BooleanEvaluationResponse

      return response.enabled
    } catch (error) {
      logger.error(error, `Feature flag not found for ${flag} /${code}`)
      return false
    }
  }

  async getFeatureVariantWithContext(code: string, flag: string, context: Record<string, string>): Promise<boolean> {
    try {
      const response = (await this.fliptClient()).evaluateVariant({
        entityId: code,
        flagKey: flag,
        context,
      }) as VariantEvaluationResponse

      return response.match
    } catch (error) {
      logger.error(error, `Feature flag not found for ${flag} /${code}`)
      return false
    }
  }

  async getFeatureVariant(code: string, flag: string): Promise<boolean> {
    try {
      const response = (await this.fliptClient()).evaluateVariant({
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
