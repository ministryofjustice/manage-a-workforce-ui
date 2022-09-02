import { SuperAgentRequest } from 'superagent'
import { stubFor } from './user-preferences-wiremock'

export default {
  stubUserPreferenceTeams: (): SuperAgentRequest => {
    return stubFor({
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
}
