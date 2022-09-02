import { SuperAgentRequest } from 'superagent'
import { stubForProbationEstate } from './wiremock'

export default {
  stubGetTeamsByPdu: (): SuperAgentRequest => {
    return stubForProbationEstate({
      request: {
        method: 'GET',
        urlPattern: `/probationDeliveryUnit/PDU1/select-teams`,
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
            code: 'TM4',
            name: 'D Team',
          },
          {
            code: 'TM3',
            name: 'C Team',
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
