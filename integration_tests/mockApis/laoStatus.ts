import { SuperAgentRequest } from 'superagent'
import { stubForLaoStatus } from './wiremock'

export default {
  stubForLaoStatus: ({ crn, response }): SuperAgentRequest => {
    return stubForLaoStatus({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/${crn}/cases/restricted`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    })
  },
}
