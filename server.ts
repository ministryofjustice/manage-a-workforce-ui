import startOpenTelemetry from './server/utils/instrumentation'
import logger from './logger'

async function start() {
  await startOpenTelemetry()
  logger.info(`OpenTelemetry started`)

  const app = (await import('./server/index')).default
  app.listen(app.get('port'), () => {
    logger.info(`Server listening on port ${app.get('port')}`)
  })
}

start().catch(err => {
  logger.error({ err }, 'Failed to start application')
  process.exit(1)
})
