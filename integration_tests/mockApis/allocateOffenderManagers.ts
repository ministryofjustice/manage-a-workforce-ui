import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubGetAllocateOffenderManagers: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/J678910/allocate/offenderManagers`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          status: 'Currently managed',
          offenderManager: {
            forenames: 'Antonio',
            surname: 'LoSardo',
            grade: 'SPO',
          },
          offenderManagersToAllocate: [
            {
              forename: 'Ben',
              surname: 'Doe',
              grade: 'PO',
              totalCommunityCases: 15,
              totalCustodyCases: 20,
              capacity: 50,
              code: 'OM1',
            },
          ],
        },
      },
    })
  },

  stubGetAllocateOffenderManagersNoOffenderManager: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/J678910/allocate/offenderManagers`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          status: 'Currently managed',
          offenderManagersToAllocate: [
            {
              forename: 'Ben',
              surname: 'Doe',
              grade: 'PO',
              totalCommunityCases: 15,
              totalCustodyCases: 20,
              capacity: 50,
              code: 'OM1',
            },
          ],
        },
      },
    })
  },

  stubGetAllocateOffenderManagersPreviouslyManaged: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/J678910/allocate/offenderManagers`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          status: 'Previously managed',
          offenderManagersToAllocate: [
            {
              forename: 'Ben',
              surname: 'Doe',
              grade: 'PO',
              totalCommunityCases: 15,
              totalCustodyCases: 20,
              capacity: 50,
              code: 'OM1',
            },
          ],
        },
      },
    })
  },

  stubGetAllocateOffenderManagersNewToProbation: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/J678910/allocate/offenderManagers`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          status: 'New to probation',
          offenderManagersToAllocate: [
            {
              forename: 'Ben',
              surname: 'Doe',
              grade: 'PO',
              totalCommunityCases: 15,
              totalCustodyCases: 20,
              capacity: 50,
              code: 'OM1',
            },
          ],
        },
      },
    })
  },
}
