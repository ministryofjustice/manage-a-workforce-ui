import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubGetPotentialOffenderManagerWorkload: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/J678910/convictions/123456789/allocate/OM1/impact`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          offenderManagerForename: 'John',
          offenderManagerSurname: 'Doe',
          offenderManagerGrade: 'PO',
          offenderManagerCurrentCapacity: 50.4,
          offenderManagerCode: 'OM1',
          offenderManagerPotentialCapacity: 64.8,
          convictionId: 123456789,
        },
      },
    })
  },
  stubGetPotentialOffenderManagerWorkloadOverCapacity: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/J678910/convictions/123456789/allocate/OM1/impact`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          offenderManagerForename: 'John',
          offenderManagerSurname: 'Doe',
          offenderManagerGrade: 'PO',
          offenderManagerCurrentCapacity: 100.2,
          offenderManagerCode: 'OM1',
          offenderManagerPotentialCapacity: 108.6,
          convictionId: 123456789,
        },
      },
    })
  },
}
