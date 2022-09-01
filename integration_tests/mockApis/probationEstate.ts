import { SuperAgentRequest } from 'superagent'
import { stubForProbationEstate } from './probation-estate-wiremock'

export default {
  stubGetTeamsByCodes: ({
    codes,
    response,
  }: {
    codes: string
    response: Record<string, unknown>
  }): SuperAgentRequest => {
    return stubForProbationEstate({
      request: {
        method: 'GET',
        urlPattern: `/team/search\\?codes=${codes}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    })
  },
}
