import { SuperAgentRequest } from 'superagent'
import { stubForAllowedRegions, stubForNoAllowedRegions, stubForOneAllowedRegion } from './wiremock'

export default {
  stubForAllowedRegions: ({ staffId }): SuperAgentRequest => {
    return stubForAllowedRegions({
      request: {
        method: 'GET',
        urlPattern: `/user/${staffId}/regions`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          regions: ['N50', 'N51', 'N52', 'N53', 'N54', 'N55', 'N56', 'N57', 'N58', 'N59', 'RG1', 'RG2', 'RG3', 'RG4'],
        },
      },
    })
  },
  stubForNoAllowedRegions: ({ staffId }): SuperAgentRequest => {
    return stubForNoAllowedRegions({
      request: {
        method: 'GET',
        urlPattern: `/user/${staffId}/regions`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          regions: ['NOT'],
        },
      },
    })
  },
  stubForOneAllowedRegion: ({ staffId }): SuperAgentRequest => {
    return stubForOneAllowedRegion({
      request: {
        method: 'GET',
        urlPattern: `/user/${staffId}/regions`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          regions: ['RG2'],
        },
      },
    })
  },
}
