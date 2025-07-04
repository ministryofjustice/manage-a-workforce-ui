// Require app insights before anything else to allow for instrumentation of bunyan and express

import startOpenTelemetry from './server/utils/instrumentation'

import app from './server/index'
import logger from './logger'

startOpenTelemetry().then(() => {
  logger.info(`OpenTelemetry started`)
})

app.listen(app.get('port'), () => {
  logger.info(`Server listening on port ${app.get('port')}`)
})
