import { SuperAgentRequest } from 'superagent'
import { stubForAllocation, stubForWorkload } from './wiremock'

export default {
  stubGetCurrentlyManagedCaseForChoosePractitioner: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/practitionerCase`,
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
          convictionNumber: 1,
        },
      },
    })
  },

  stubGetCurrentlyManagedNoOffenderManagerCaseForChoosePractitioner: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/practitionerCase`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          status: 'Currently managed',
          convictionNumber: 1,
        },
      },
    })
  },

  stubGetPreviouslyManagedNoOffenderManagerCaseForChoosePractitioner: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/practitionerCase`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          status: 'Previously managed',
          convictionNumber: 1,
        },
      },
    })
  },

  stubGetPreviouslyManagedCaseForChoosePractitioner: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/practitionerCase`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          status: 'Previously managed',
          offenderManager: {
            forenames: 'Sofia',
            surname: 'Micheals',
            grade: 'PO',
          },
          convictionNumber: 1,
        },
      },
    })
  },

  stubGetNewToProbationCaseForChoosePractitioner: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/practitionerCase`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          status: 'New to probation',
          convictionNumber: 1,
        },
      },
    })
  },
  stubChoosePractitioners: (/* crn = 'J678910', teamCodes = ['N03F01', 'N03F02'] */): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPath: `/whatever/J678910/doit`,
        queryParameters: {
          grades: {
            equalTo: 'PSO,PQiP,PO',
          },
        },
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: 'X595589',
          name: {
            forename: 'Don',
            middleName: '',
            surname: 'Cole',
          },
          probationStatus: {
            status: 'PREVIOUSLY_MANAGED',
            description: 'Previously managed',
          },
          communityPersonManager: {
            code: 'N03A019',
            name: {
              forename: 'Derek',
              surname: 'Pint',
            },
            teamCode: 'N03F01',
            grade: 'PO',
          },
          teams: {
            N03F01: [
              {
                code: 'OM1',
                name: {
                  forename: 'Jane',
                  middleName: '',
                  surname: 'Doe',
                },
                email: 'j.doe@email.co.uk',
                grade: 'PO',
                workload: 19,
                casesPastWeek: 2,
                communityCases: 3,
                custodyCases: 5,
              },
            ],
            N03F02: [
              {
                code: 'OM2',
                name: {
                  forename: 'Sam',
                  surname: 'Smam',
                },
                grade: 'SPO',
                workload: 32,
                casesPastWeek: 5,
                communityCases: 0,
                custodyCases: 5,
              },
              {
                code: 'OM3',
                name: {
                  forename: 'Jim',
                  surname: 'Jam',
                },
                email: 'j.jam@email.co.uk',
                grade: 'PO',
                workload: 32,
                casesPastWeek: 5,
                communityCases: 0,
                custodyCases: 5,
              },
            ],
          },
        },
      },
    })
  },
}
