import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './workload-wiremock'

export default {
  stubGetPotentialOffenderManagerWorkload: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/team/N03F01/offenderManager/OM1/impact`,
        bodyPatterns: [
          {
            equalToJson: '{"crn":"J678910", "convictionId": 123456789}',
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          forename: 'John',
          surname: 'Doe',
          grade: 'PO',
          capacity: 50.4,
          code: 'OM1',
          potentialCapacity: 64.8,
        },
      },
    })
  },
  stubGetPotentialOffenderManagerWorkloadOverCapacity: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/team/N03F01/offenderManager/OM1/impact`,
        bodyPatterns: [
          {
            equalToJson: '{"crn":"J678910", "convictionId": 123456789}',
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          forename: 'John',
          surname: 'Doe',
          grade: 'PO',
          capacity: 100.2,
          code: 'OM1',
          potentialCapacity: 108.6,
        },
      },
    })
  },
}
