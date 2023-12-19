/* eslint-disable import/first */
/*
 * Do appinsights first as it does some magic instrumentation work, i.e. it affects other 'require's
 * In particular, applicationinsights automatically collects bunyan logs
 */
import { initialiseAppInsights, buildAppInsightsClient } from '../utils/azureAppInsights'

initialiseAppInsights()
buildAppInsightsClient()

import ManageUsersClient from './manageUsersClient'

type RestClientBuilder<T> = (token: string) => T

export const dataAccess = () => ({
  manageUsersClient: new ManageUsersClient(),
})

export type DataAccess = ReturnType<typeof dataAccess>

export { ManageUsersClient, RestClientBuilder }
