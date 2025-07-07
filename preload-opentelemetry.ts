import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { AzureMonitorTraceExporter } from '@azure/monitor-opentelemetry-exporter'
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base'

const key = process.env.APPINSIGHTS_INSTRUMENTATIONKEY
const connStr = `InstrumentationKey=${key};IngestionEndpoint=https://northeurope-0.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/;`

// Prevent double initialization
global.otelStarted = global.otelStarted || false

if (!global.otelStarted) {
  if (connStr) {
    const exporter = new AzureMonitorTraceExporter({ connectionString: connStr })
    const sdk = new NodeSDK({
      serviceName: 'manage-a-workforce-ui',
      spanProcessors: [new BatchSpanProcessor(exporter)],
      instrumentations: [getNodeAutoInstrumentations()],
    })
    sdk.start()
  }
  global.otelStarted = true
}
