import { SuperAgentRequest } from 'superagent'
import { stubForAllocation } from './wiremock'

export default {
  stubTokenVerificationPing: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: '/verification/health/ping',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { status: 'UP' },
      },
    })
  },
  stubVerifyToken: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'POST',
        urlPattern: '/verification/token/verify',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: { active: 'true' },
      },
    })
  },
}
