import bunyan from 'bunyan'
import bunyanFormat from 'bunyan-format'
import { buildAppInsightsClient } from './server/utils/azureAppInsights'

const formatOut = bunyanFormat({ outputMode: 'short', color: true })

const logger = bunyan.createLogger({ name: 'Manage A Workforce Ui', stream: formatOut, level: 'debug' })

const appInsightsClient = buildAppInsightsClient()

export default {
  info(message) {
    logger.info({ message })
  },
  error(error: Error, message: string) {
    if (appInsightsClient) {
      appInsightsClient.trackException({ exception: error })
    }
    logger.error(error, message)
  },
  warn: logger.warn.bind(logger),
  debug: logger.debug.bind(logger),
}
