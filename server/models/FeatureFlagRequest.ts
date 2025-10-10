export default interface FeatureFlagRequest {
  namespace: string
  entityId: string
  flagKey: string
  context?: Map<string, string>
}
