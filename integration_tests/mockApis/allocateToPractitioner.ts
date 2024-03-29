import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubGetPotentialOffenderManagerWorkload: ({
    teamCode = 'TM2',
    staffCode = 'OM2',
  }: {
    teamCode?: string
    staffCode?: string
  }): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/${teamCode}/offenderManager/${staffCode}/impact/person/J678910`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          capacity: 50.4,
          potentialCapacity: 64.8,
          name: {
            forename: 'Dylan',
            middleName: 'Adam',
            surname: 'Armstrong',
            combinedName: 'Dylan Adam Armstrong',
          },
          staff: {
            code: 'OM2',
            name: {
              forename: 'John',
              surname: 'Doe',
              combinedName: 'John Doe',
            },
            grade: 'PO',
          },
          tier: 'C1',
        },
      },
    })
  },
  stubGetPotentialOffenderManagerWorkloadOverCapacity: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/TM2/offenderManager/OM2/impact/person/J678910`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          capacity: 100.2,
          potentialCapacity: 108.6,
          name: {
            forename: 'Dylan',
            middleName: 'Adam',
            surname: 'Armstrong',
            combinedName: 'Dylan Adam Armstrong',
          },
          staff: {
            code: 'OM2',
            name: {
              forename: 'John',
              surname: 'Doe',
              combinedName: 'John Doe',
            },
            grade: 'PO',
          },
          tier: 'C1',
        },
      },
    })
  },
  stubGetPotentialOffenderManagerWorkloadOverCapacitySamePoP: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/TM2/offenderManager/OM2/impact/person/J678910`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          capacity: 50.4,
          potentialCapacity: 50.4,
          name: {
            forename: 'Dylan',
            middleName: 'Adam',
            surname: 'Armstrong',
            combinedName: 'Dylan Adam Armstrong',
          },
          staff: {
            code: 'OM2',
            name: {
              forename: 'John',
              surname: 'Doe',
              combinedName: 'John Doe',
            },
            grade: 'PO',
          },
          tier: 'C1',
        },
      },
    })
  },
}
