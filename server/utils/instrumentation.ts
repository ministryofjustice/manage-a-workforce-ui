import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { useAzureMonitor } from '@azure/monitor-opentelemetry'

export default function instrumentation(): void {
  if (process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'preprod' || process.env.NODE_ENV === 'dev') {
    const connectionString =
      process.env.APPLICATIONINSIGHTS_CONNECTION_STRING ||
      (process.env.APPINSIGHTS_INSTRUMENTATIONKEY
        ? `InstrumentationKey=${process.env.APPINSIGHTS_INSTRUMENTATIONKEY}`
        : undefined)

    if (!connectionString) {
      console.warn('Azure Monitor not configured: no connection string or instrumentation key found.')
    } else {
      useAzureMonitor({
        azureMonitorExporterOptions: {
          connectionString,
        },
      })

      const sdk = new NodeSDK({
        instrumentations: [getNodeAutoInstrumentations()],
      })

      sdk.start()
      console.log('OpenTelemetry started')
    }
  }
}
