import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'
import { defaultClient as appInsightsClient } from 'applicationinsights'

const formatOut = bunyanFormat({ outputMode: 'short', color: true })

const logger = bunyan.createLogger({ name: 'Manage A Workforce Ui', stream: formatOut, level: 'debug' })

export default {
  info(message) {
    logger.info({ message })
  },
  error(error, message) {
    if (appInsightsClient) {
      logger.info({ message: 'app insights is enabled' })
      appInsightsClient.trackException({ exception: error })
    }
    logger.error(error, message)
  },
  warn: logger.warn.bind(logger),
  debug: logger.debug.bind(logger),
}
