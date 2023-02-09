import { SuperAgentRequest } from 'superagent'
import { stubForAllocation } from './wiremock'

export default {
  stubGetCurrentlyManagedCaseOverview: (convictionId = '123456789'): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/${convictionId}/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          convictionId: 123456789,
          convictionNumber: 1,
        },
      },
    })
  },
}
