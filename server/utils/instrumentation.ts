import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { useAzureMonitor } from '@azure/monitor-opentelemetry'
import logger from '../../logger'

logger.info(`AppInsights key length ${process.env.APPINSIGHTS_INSTRUMENTATIONKEY}`)
const OTEL_STARTED = Symbol.for('myapp.otel.started')

export default async function instrumentation(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    logger.info(`Running instrumentation mode`)
    const connectionString =
      process.env.APPLICATIONINSIGHTS_CONNECTION_STRING ||
      (process.env.APPINSIGHTS_INSTRUMENTATIONKEY
        ? `InstrumentationKey=${process.env.APPINSIGHTS_INSTRUMENTATIONKEY}`
        : undefined)
    logger.info(`Instrumentation connection string=${connectionString}`)
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

      if (!global[OTEL_STARTED]) {
        await sdk.start()
        global[OTEL_STARTED] = true
        logger.info('OpenTelemetry started')
      }
    }
  }
}
