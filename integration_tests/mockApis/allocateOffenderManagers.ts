import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './workload-wiremock'

export default {
  stubGetAllocateOffenderManagers: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPath: `/team/N03F01/offenderManagers`,
        queryParameters: {
          grades: {
            equalTo: 'PSO,PQiP,PO',
          },
        },
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          offenderManagers: [
            {
              forename: 'John',
              surname: 'Smith',
              grade: 'PO',
              totalCommunityCases: 25,
              totalCustodyCases: 15,
              capacity: 10,
              code: 'OM3',
              staffId: 123455423,
            },
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
