/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from './server/utils/azureAppInsights'

initialiseAppInsights()
buildAppInsightsClient()

import createApplication from './server/index'
import logger from './logger'

createApplication()
  .then(app => {
    app.listen(app.get('port'), () => {
      logger.info(`Server listening on port: ${app.get('port')}`)
    })
  })
  .catch(error => {
    logger.error(`Failed to start application: ${error.message}`)
  })
