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

function connectionString(): string {
  return Buffer.from(`${process.env.APPLICATIONINSIGHTS_CONNECTION_STRING}`, 'base64').toString('utf8')
}

if (process.env.APPLICATIONINSIGHTS_CONNECTION_STRING) {
  // eslint-disable-next-line no-console
  console.log('Enabling azure application insights')

  initialiseTelemetry({
    serviceName: defaultName(),
    serviceVersion: version(),
    connectionString: connectionString(),
  })
    .addFilter(telemetry.processors.filterSpanWherePath(['/health', '/ping', '/assets/*']))
    .addModifier(telemetry.processors.enrichSpanNameWithHttpRoute())
    .startRecording()

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    await flushTelemetry()
    process.exit(0)
  })
}
