import { SuperAgentRequest } from 'superagent'
import { stubForAllocation } from './wiremock'

export default {
  stubCrnLookup: ({ crn, allocated }: { crn: string; allocated?: boolean }): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/allocated/crn/${crn}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: 'A123456',
          name: {
            forename: 'Jane',
            middleName: '',
            surname: 'Doe',
            combinedName: 'Jane Doe',
          },
          dateOfBirth: '1958-05-25',
          manager: {
            code: 'T35T1NG',
            name: {
              forename: 'John',
              middleName: '',
              surname: 'Doe',
              combinedName: 'John Doe',
            },
            teamCode: 'T35T1NG',
            grade: null,
            allocated: allocated ?? true,
          },
          hasActiveOrder: true,
        },
      },
    })
  },

  stubCrnLookupError: ({ crn }: { crn: string }): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/allocated/crn/${crn}`,
      },
      response: {
        status: 500,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    })
  },
}
