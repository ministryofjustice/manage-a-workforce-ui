import { SuperAgentRequest } from 'superagent'
import { stubForFeatureflags } from './wiremock'

export default {
  stubForFeatureflagEnabled: (): SuperAgentRequest => {
    return stubForFeatureflags({
      request: {
        method: 'GET',
        urlPattern: '/internal/v1/evaluation/snapshot/namespace/ManageAWorkforce',
      },
      response: {
        status: 200,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8',
        },
        jsonBody: {
          enabled: true,
          reason: 'UNKNOWN_EVALUATION_REASON',
          requestId: '123',
          requestDurationMilliseconds: '123',
          timestamp: '2023-11-07T05:31:56Z',
          flagKey: '123',
          segmentKeys: ['john smith'],
        },
      },
    })
  },
}
