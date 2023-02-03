import { SuperAgentRequest } from 'superagent'
import { stubForStaffLookup } from './wiremock'

export default {
  stubSearchStaff: (): SuperAgentRequest => {
    return stubForStaffLookup({
      request: {
        method: 'GET',
        urlPath: '/staff/search',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          items: [
            {
              firstName: 'First',
              lastName: 'Name',
              email: 'first@justice.gov.uk',
            },
          ],
        },
      },
    })
  },
}
