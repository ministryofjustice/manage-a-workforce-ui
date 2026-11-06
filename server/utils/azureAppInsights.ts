import { initialiseTelemetry, flushTelemetry, telemetry } from '@ministryofjustice/hmpps-azure-telemetry'
import applicationVersion from '../applicationVersion'

function defaultName(): string {
  const {
    packageData: { name },
  } = applicationVersion
  return name
}

function version(): string {
  const { buildNumber } = applicationVersion
  return buildNumber
}

initialiseTelemetry({
  serviceName: defaultName(),
  serviceVersion: version(),
  connectionString: process.env.APPINSIGHTS_INSTRUMENTATIONKEY,
})
  .addFilter(telemetry.processors.filterSpanWherePath(['/health', '/ping', '/assets/*']))
  .addModifier(telemetry.processors.enrichSpanNameWithHttpRoute())
  .startRecording()

// Graceful shutdown
process.on('SIGTERM', async () => {
  await flushTelemetry()
  process.exit(0)
})
