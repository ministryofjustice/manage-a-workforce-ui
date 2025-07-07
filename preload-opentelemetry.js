// preload-opentelemetry.js
const { NodeSDK } = require('@opentelemetry/sdk-node')
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node')
const { AzureMonitorTraceExporter } = require('@azure/monitor-opentelemetry-exporter')
const { BatchSpanProcessor } = require('@opentelemetry/sdk-trace-base')

// Prevent double initialization
global.otelStarted = global.otelStarted || false

if (!global.otelStarted) {
  const key = process.env.APPINSIGHTS_INSTRUMENTATIONKEY
  const connStr = `InstrumentationKey=${key};IngestionEndpoint=https://northeurope-0.in.applicationinsights.azure.com/;LiveEndpoint=https://northeurope.livediagnostics.monitor.azure.com/;`
  if (connStr) {
    // Setup Azure exporter and SDK
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
