import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubGetStaffByCode: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/staff/code/OM1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          forename: 'John',
          surname: 'Doe',
          email: 'john.doe@test.justice.gov.uk',
          id: 5678,
        },
      },
    })
  },
}
