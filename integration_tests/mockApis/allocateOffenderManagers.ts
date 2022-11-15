import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubGetAllocateOffenderManagers: (teamCode = 'N03F01'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPath: `/team/${teamCode}/offenderManagers`,
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
              totalCasesInLastWeek: 3,
              email: 'john@email.com',
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
              totalCasesInLastWeek: 0,
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
              totalCasesInLastWeek: 6,
              email: 'sally@email.com',
            },
          ],
        },
      },
    })
  },
  stubGetAllocateOffenderManagersWithEmails: (teamCode = 'TM1'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPath: `/team/${teamCode}/offenderManagers`,
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
              totalCasesInLastWeek: 3,
              email: 'john@email.com',
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
              totalCasesInLastWeek: 0,
              email: 'ben@email.com',
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
              totalCasesInLastWeek: 6,
              email: 'sally@email.com',
            },
          ],
        },
      },
    })
  },
}
