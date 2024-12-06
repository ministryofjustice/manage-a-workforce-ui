import { SuperAgentRequest } from 'superagent'
import { stubForLaoStatus403 } from './wiremock'

export default {
  stubForLaoStatus403: ({ crn }): SuperAgentRequest => {
    return stubForLaoStatus403({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/${crn}/restricted`,
      },
      response: {
        status: 403,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {},
      },
    })
  },
}
