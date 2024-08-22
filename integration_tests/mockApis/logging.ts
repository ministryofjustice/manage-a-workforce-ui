import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubSendComparisionLogToWorkload: (notesChanged: boolean = true): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/allocations/contact/logging`,
        bodyPatterns: [
          {
            equalToJson: JSON.stringify({
              crn: 'J678910',
              teamCode: 'TM2',
              isSPOOversightAccessed: true,
              notesChanged,
            }),
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {},
      },
    })
  },
  stubSendComparisonLogToWorkloadUnchanged: (notesChanged: boolean = false): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/allocations/contact/logging`,
        bodyPatterns: [],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {},
      },
    })
  },
}
