import { SuperAgentRequest } from 'superagent'
import { stubForStaffLookup } from './wiremock'

export default {
  stubSearchStaff: (): SuperAgentRequest => {
    return stubForStaffLookup({
      request: {
        method: 'GET',
        urlPattern: '/staff/search?.*',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [
          {
            firstName: 'First',
            lastName: 'Name',
            fullName: 'First Name',
            email: 'first@justice.gov.uk',
          },
          {
            firstName: 'Second',
            lastName: 'Name',
            fullName: 'Second Name',
            email: 'second@justice.gov.uk',
          },
        ],
      },
    })
  },
  stubSearchStaffError: (): SuperAgentRequest => {
    return stubForStaffLookup({
      request: {
        method: 'GET',
        urlPattern: '/staff/search?.*',
      },
      response: {
        status: 500,
      },
    })
  },
  stubSearchStaffNoResults: (): SuperAgentRequest => {
    return stubForStaffLookup({
      request: {
        method: 'GET',
        urlPattern: '/staff/search?.*',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [],
      },
    })
  },
}
