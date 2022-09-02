import { SuperAgentRequest } from 'superagent'
import { stubForUserPreference, verifyRequestForUserPreference } from './wiremock'

export default {
  stubUserPreferenceTeams: (teams = ['TM1']): SuperAgentRequest => {
    return stubForUserPreference({
      request: {
        method: 'GET',
        urlPattern: `/users/USER1/preferences/allocation-teams`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          items: teams,
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
            equalToJson: '{ "items": ["TM1", "TM2"]}',
          },
        ],
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          items: ['TM1', 'TM2'],
        },
      },
    })
  },
  verifySaveOffenceDetails: () =>
    verifyRequestForUserPreference({
      requestUrlPattern: `/users/USER1/preferences/allocation-teams`,
      method: 'PUT',
      body: {
        items: ['TM1', 'TM2'],
      },
    }),
}
