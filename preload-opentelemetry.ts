import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics'
import { AzureMonitorTraceExporter, AzureMonitorMetricExporter } from '@azure/monitor-opentelemetry-exporter'

// Declare global marker without leading underscores or var
declare global {
  // eslint-disable-next-line vars-on-top
  var otelAlreadyStarted: boolean | undefined
}

if (process.env.NODE_ENV === 'production') {
  const key = process.env.APPINSIGHTS_INSTRUMENTATIONKEY
  const connStr = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING || (key ? `InstrumentationKey=${key}` : undefined)

  if (connStr && !globalThis.otelAlreadyStarted) {
    const metricExporter = new AzureMonitorMetricExporter({ connectionString: connStr })
    const metricReader = new PeriodicExportingMetricReader({ exporter: metricExporter })

    const sdk = new NodeSDK({
      traceExporter: new AzureMonitorTraceExporter({ connectionString: connStr }),
      metricReader,
      instrumentations: [getNodeAutoInstrumentations()],
    })

    sdk.start() // synchronous in this version
    globalThis.otelAlreadyStarted = true
  }
}
