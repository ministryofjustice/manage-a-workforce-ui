import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { useAzureMonitor } from '@azure/monitor-opentelemetry'
import logger from '../../logger'

const otelStartedSymbol = Symbol.for('otel.started')

logger.info(`AppInsights key length ${process.env.APPINSIGHTS_INSTRUMENTATIONKEY}`)

export default async function instrumentation(): Promise<void> {
  if (process.env.NODE_ENV?.toLowerCase() === 'production') {
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

      const globalSymbols = Object.getOwnPropertySymbols(globalThis)
      const alreadyStarted = globalSymbols.includes(otelStartedSymbol)

      if (!alreadyStarted) {
        await sdk.start()
        Object.defineProperty(globalThis, otelStartedSymbol, {
          value: true,
          writable: false,
          enumerable: false,
          configurable: false,
        })
        logger.info('OpenTelemetry started')
      }
    }
  }
}
