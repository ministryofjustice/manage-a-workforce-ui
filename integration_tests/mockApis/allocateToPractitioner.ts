import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubGetPotentialOffenderManagerWorkload: (teamCode = 'TM1'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/${teamCode}/offenderManager/OM2/impact/person/J678910`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          forename: 'John',
          surname: 'Doe',
          grade: 'PO',
          capacity: 50.4,
          code: 'OM2',
          potentialCapacity: 64.8,
        },
      },
    })
  },
  stubGetPotentialOffenderManagerWorkloadTM1: (
    teamCode = 'TM1',
    crn = 'J678910',
    staffCode = 'OM3'
  ): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/${teamCode}/offenderManager/${staffCode}/impact/person/${crn}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          forename: 'John',
          surname: 'Doe',
          grade: 'PO',
          capacity: 50.4,
          code: 'OM2',
          potentialCapacity: 64.8,
        },
      },
    })
  },
  stubGetPotentialOffenderManagerWorkloadOverCapacity: (teamCode = 'TM1'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/${teamCode}/offenderManager/OM2/impact/person/J678910`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          forename: 'John',
          surname: 'Doe',
          grade: 'PO',
          capacity: 100.2,
          code: 'OM2',
          potentialCapacity: 108.6,
        },
      },
    })
  },
  stubGetPotentialOffenderManagerWorkloadOverCapacitySamePoP: (teamCode = 'TM1'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/${teamCode}/offenderManager/OM2/impact/person/J678910`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          forename: 'John',
          surname: 'Doe',
          grade: 'PO',
          capacity: 50.4,
          code: 'OM2',
          potentialCapacity: 50.4,
        },
      },
    })
  },
}
