import { SuperAgentRequest } from 'superagent'
import { stubForManageUsers } from './wiremock'

export default {
  stubAuthUser: (): SuperAgentRequest => {
    return stubForManageUsers({
      request: {
        method: 'GET',
        urlPattern: '/users/me',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          staffId: 231232,
          username: 'USER1',
          active: true,
          name: 'john smith',
        },
      },
    })
  },
}
