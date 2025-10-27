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
          namespace: {
            key: 'ManageAWorkforce',
          },
          flags: [
            {
              key: 'Reallocations',
              name: 'Reallocations',
              description: 'Flag for reallocations work',
              enabled: true,
              type: 'BOOLEAN_FLAG_TYPE',
              createdAt: '2025-10-13T12:59:53.136978Z',
              updatedAt: '2025-10-21T11:34:42.350567Z',
              rules: [],
              rollouts: [],
            },
          ],
        },
      },
    })
  },
}
