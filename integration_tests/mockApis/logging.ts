import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubSendComparisionLogToWorkload: (): SuperAgentRequest => {
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
              notesChanged: true,
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
}
