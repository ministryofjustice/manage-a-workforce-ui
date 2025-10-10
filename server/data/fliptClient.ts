import { FliptClient } from '@flipt-io/flipt-client-js'
import config from '../config'

// eslint-disable-next-line import/prefer-default-export
export const createClient = async (): Promise<FliptClient> => {
  const client = await FliptClient.init({
    namespace: config.fliptClient.namespace,
    url: config.fliptClient.url,
    authentication: {
      clientToken: config.fliptClient.apiClientSecret,
    },
  })
  return client
}
