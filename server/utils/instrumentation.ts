import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { useAzureMonitor } from '@azure/monitor-opentelemetry'
import logger from '../../logger'

export default function instrumentation(): void {
  if (process.env.NODE_ENV === 'production') {
    const connectionString =
      process.env.APPLICATIONINSIGHTS_CONNECTION_STRING ||
      (process.env.APPINSIGHTS_INSTRUMENTATIONKEY
        ? `InstrumentationKey=${process.env.APPINSIGHTS_INSTRUMENTATIONKEY}`
        : undefined)

    if (!connectionString) {
      logger.warn('Azure Monitor not configured: no connection string or instrumentation key found.')
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
      logger.info('OpenTelemetry started')
    }
  }
}
