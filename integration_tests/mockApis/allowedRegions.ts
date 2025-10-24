import { SuperAgentRequest } from 'superagent'
import {
  stubForAllowedRegions,
  stubForNoAllowedRegions,
  stubForOneAllowedRegion,
  stubForCrnAllowedUserRegion,
  stubForPduAllowedForUser,
  stubForRegionAllowedForUser,
  stubForFeatureflagEnabled,
} from './wiremock'

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
  stubForCrnAllowedUserRegion: ({ userId, crn, convictionNumber, errorCode }): SuperAgentRequest => {
    return stubForCrnAllowedUserRegion({
      request: {
        method: 'GET',
        urlPattern: `/user/${userId}/crn/${crn}/conviction/${convictionNumber}/is-allowed`,
      },
      response: {
        status: errorCode,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {},
      },
    })
  },
  stubForPduAllowedForUser: ({ userId, pdu, errorCode }): SuperAgentRequest => {
    return stubForPduAllowedForUser({
      request: {
        method: 'GET',
        urlPattern: `/user/${userId}/pdu/${pdu}/is-allowed`,
      },
      response: {
        status: errorCode,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {},
      },
    })
  },
  stubForRegionAllowedForUser: ({ userId, region, errorCode }): SuperAgentRequest => {
    return stubForRegionAllowedForUser({
      request: {
        method: 'GET',
        urlPattern: `/user/${userId}/region/${region}/is-allowed`,
      },
      response: {
        status: errorCode,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {},
      },
    })
  },
}
