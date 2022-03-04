import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubGetAllocateOffenderManagers: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/J678910/convictions/123456789/allocate/offenderManagers`,
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
            {
              forename: 'Sally',
              surname: 'Smith',
              grade: 'PSO',
              totalCommunityCases: 25,
              totalCustodyCases: 28,
              capacity: 80,
              code: 'OM2',
            },
          ],
          convictionId: 123456789,
          caseType: 'CUSTODY',
        },
      },
    })
  },

  stubGetAllocateOffenderManagersNoOffenderManager: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/J678910/convictions/123456789/allocate/offenderManagers`,
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
          convictionId: 123456789,
          caseType: 'CUSTODY',
        },
      },
    })
  },

  stubGetAllocateOffenderManagersPreviouslyManaged: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/J678910/convictions/123456789/allocate/offenderManagers`,
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
          convictionId: 123456789,
          caseType: 'CUSTODY',
        },
      },
    })
  },

  stubGetAllocateOffenderManagersNewToProbation: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/J678910/convictions/123456789/allocate/offenderManagers`,
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
          convictionId: 123456789,
          caseType: 'CUSTODY',
        },
      },
    })
  },
}
