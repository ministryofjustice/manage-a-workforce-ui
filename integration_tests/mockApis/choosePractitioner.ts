import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubGetCurrentlyManagedCaseForChoosePractitioner: (
    teamCodes = ['N03F01', 'N03F02'],
    crn = 'J678910',
  ): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPath: `/team/choose-practitioner`,
        queryParameters: {
          crn: {
            equalTo: crn,
          },
          teamCodes: {
            equalTo: teamCodes.join(','),
          },
          grades: {
            equalTo: 'PSO,PQiP,PO',
          },
        },
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn,
          name: {
            forename: 'Dylan Adam',
            middleName: '',
            surname: 'Armstrong',
          },
          tier: 'C1',
          probationStatus: {
            status: 'CURRENTLY_MANAGED',
            description: 'Currently managed',
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
          },
        },
      },
    })
  },

  stubGetCurrentlyManagedNoOffenderManagerCaseForChoosePractitioner: (
    teamCodes = ['N03F01', 'N03F02'],
    crn = 'J678910',
  ): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPath: `/team/choose-practitioner`,
        queryParameters: {
          crn: {
            equalTo: crn,
          },
          teamCodes: {
            equalTo: teamCodes.join(','),
          },
          grades: {
            equalTo: 'PSO,PQiP,PO',
          },
        },
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn,
          name: {
            forename: 'Dylan Adam',
            middleName: '',
            surname: 'Armstrong',
          },
          tier: 'C1',
          probationStatus: {
            status: 'CURRENTLY_MANAGED',
            description: 'Currently managed',
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
          },
        },
      },
    })
  },

  stubGetPreviouslyManagedNoOffenderManagerCaseForChoosePractitioner: (
    teamCodes = ['N03F01', 'N03F02'],
    crn = 'J678910',
  ): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPath: `/team/choose-practitioner`,
        queryParameters: {
          crn: {
            equalTo: crn,
          },
          teamCodes: {
            equalTo: teamCodes.join(','),
          },
          grades: {
            equalTo: 'PSO,PQiP,PO',
          },
        },
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn,
          name: {
            forename: 'Dylan Adam',
            middleName: '',
            surname: 'Armstrong',
          },
          tier: 'C1',
          probationStatus: {
            status: 'PREVIOUSLY_MANAGED',
            description: 'Previously managed',
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
          },
        },
      },
    })
  },

  stubGetNewToProbationCaseForChoosePractitioner: (
    teamCodes = ['N03F01', 'N03F02'],
    crn = 'J678910',
  ): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPath: `/team/choose-practitioner`,
        queryParameters: {
          crn: {
            equalTo: crn,
          },
          teamCodes: {
            equalTo: teamCodes.join(','),
          },
          grades: {
            equalTo: 'PSO,PQiP,PO',
          },
        },
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn,
          name: {
            forename: 'Dylan Adam',
            middleName: '',
            surname: 'Armstrong',
          },
          tier: 'C1',
          probationStatus: {
            status: 'NEW_TO_PROBATION',
            description: 'New to probation',
          },
          communityPersonManager: {
            code: 'N03A019',
            name: {
              forename: 'Derek',
              surname: 'Pint',
            },
            teamCode: 'N03F01',
            grade: 'SPO',
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
          },
        },
      },
    })
  },

  stubChoosePractitioners: ({
    teamCodes = ['N03F01', 'N03F02'],
    crn = 'J678910',
    teams = {
      N03F01: [
        {
          code: 'OM1',
          name: {
            forename: 'Jane',
            middleName: '',
            surname: 'Doe',
          },
          email: 'j.doe@email.co.uk',
          grade: 'PQiP',
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
  }: {
    teamCodes?: string[]
    crn?: string
    teams?: Record<string, unknown>
  }): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPath: `/team/choose-practitioner`,
        queryParameters: {
          crn: {
            equalTo: crn,
          },
          teamCodes: {
            equalTo: teamCodes.join(','),
          },
          grades: {
            equalTo: 'PSO,PQiP,PO',
          },
        },
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn,
          name: {
            forename: 'Don',
            middleName: '',
            surname: 'Cole',
          },
          tier: 'C1',
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
          teams,
        },
      },
    })
  },
  stubChoosePractitionersWithEmails: (teamCodes = ['N03F01', 'N03F02'], crn = 'J678910'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPath: `/team/choose-practitioner`,
        queryParameters: {
          crn: {
            equalTo: crn,
          },
          teamCodes: {
            equalTo: teamCodes.join(','),
          },
          grades: {
            equalTo: 'PSO,PQiP,PO',
          },
        },
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn,
          name: {
            forename: 'Don',
            middleName: '',
            surname: 'Cole',
          },
          tier: 'C1',
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
          },
        },
      },
    })
  },
}
