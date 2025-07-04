import { NodeSDK } from '@opentelemetry/sdk-node'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { useAzureMonitor } from '@azure/monitor-opentelemetry'

useAzureMonitor({
  azureMonitorExporterOptions: {
    connectionString: process.env.APPLICATIONINSIGHTS_CONNECTION_STRING,
  },
})

const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
})

export default function startOpenTelemetry(): Promise<void> {
  return sdk.start()
}
