import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubWorkloadCases: ({
    teamCodes,
    response,
  }: {
    teamCodes: string
    response: Record<string, unknown>[]
  }): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/workloadcases\\?teams=${teamCodes}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    })
  },
  stubGetEventManagerDetails: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: '/allocation/event/eventId/123456789/details',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          tier: 'A3',
          personOnProbationFirstName: 'Sally',
          personOnProbationSurname: 'Smith',
        },
      },
    })
  },
}
