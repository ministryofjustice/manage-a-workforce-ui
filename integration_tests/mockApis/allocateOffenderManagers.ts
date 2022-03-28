import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './workload-wiremock'

export default {
  stubGetAllocateOffenderManagers: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/N03F01/offenderManagers`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          offenderManagers: [
            {
              forename: 'Ben',
              surname: 'Doe',
              grade: 'PO',
              totalCommunityCases: 15,
              totalCustodyCases: 20,
              capacity: 50,
              code: 'OM1',
              staffId: 12345,
            },
            {
              forename: 'Sally',
              surname: 'Smith',
              grade: 'PSO',
              totalCommunityCases: 25,
              totalCustodyCases: 28,
              capacity: 80,
              code: 'OM2',
              staffId: 6789,
            },
          ],
        },
      },
    })
  },
}
