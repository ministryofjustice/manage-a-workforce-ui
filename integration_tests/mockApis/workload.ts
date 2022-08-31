import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './workload-wiremock'

export default {
  stubWorkloadCases: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/workloadcases?teams=TM1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          teamCode: 'TM1',
          totalCases: 2,
          workload: 77,
        },
      },
    })
  },
}
