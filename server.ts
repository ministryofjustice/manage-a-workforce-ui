import flushTelemetry from './server/utils/azureAppInsights'
import app from './server/index'
import logger from './logger'

const shutdown = async () => {
  await flushTelemetry()
  process.exit(0)
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`)
})
