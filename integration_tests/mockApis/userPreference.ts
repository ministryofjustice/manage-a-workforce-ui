import { SuperAgentRequest } from 'superagent'
import { stubForUserPreference } from './wiremock'

export default {
  stubUserPreferenceTeams: (): SuperAgentRequest => {
    return stubForUserPreference({
      request: {
        method: 'GET',
        urlPattern: `/users/USER1/preferences/allocation-teams`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          items: ['TM1'],
        },
      },
    })
  },
  stubPutUserPreferenceTeams: (): SuperAgentRequest => {
    return stubForUserPreference({
      request: {
        method: 'PUT',
        urlPattern: `/users/USER1/preferences/allocation-teams`,
        bodyPatterns: [
          {
            equalToJson: '{ "items": ["TM1"]}',
          },
        ],
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          items: ['TM1'],
        },
      },
    })
  },
}
