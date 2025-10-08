import { VariantEvaluationResponse, BooleanEvaluationResponse } from '@flipt-io/flipt-client-js'
import { createClient } from '../data/fliptClient'

const fliptClient = createClient()

export default class FeatureFlagService {
  async getVariantFeatureFlag(key: string, context: Record<string, string>): Promise<boolean> {
    const response = (await fliptClient).evaluateVariant({
      entityId: key,
      flagKey: key,
      context,
    }) as VariantEvaluationResponse

    return response.match
  }

  async getFeatureFlag(key: string, context: Record<string, string>): Promise<boolean> {
    const response = (await fliptClient).evaluateBoolean({
      entityId: key,
      flagKey: key,
      context,
    }) as BooleanEvaluationResponse

    return response.enabled
  }
}
