import { SuperAgentRequest } from 'superagent'
import { stubForProbationEstate } from './probation-estate-wiremock'

export default {
  stubGetTeamsByPdu: (): SuperAgentRequest => {
    return stubForProbationEstate({
      request: {
        method: 'GET',
        urlPattern: `/probationDeliveryUnit/PDU1/teams`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [
          {
            code: 'TM1',
            name: 'A Team',
          },
          {
            code: 'TM2',
            name: 'B Team',
          },
        ],
      },
    })
  },
}
