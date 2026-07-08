import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

const defaultTierCaseTotals = {
  untiered: 3,
  a: 1,
  b: 4,
  c: 2,
  d: 0,
  as: 1,
  bs: 0,
  cs: 2,
  ds: 0,
}

const defaultPractitionerMetrics = {
  allocatedCasesPastWeek: 0,
  reallocatedCasesPastWeek: 0,
  ispsDueInNext14Days: 0,
  activeCases: 0,
  contactSuspendedCases: 0,
  custodyReleasesInNext7Days: 0,
  paroleReportsInNext28Days: 0,
  otherReportsInNext14Days: 0,
  licenseCases: 0,
  tierCaseTotals: defaultTierCaseTotals,
}

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
                licenseCases: 3,
                allocatedCasesPastWeek: 3,
                reallocatedCasesPastWeek: 4,
                ispsDueInNext14Days: 1,
                activeCases: 15,
                contactSuspendedCases: 2,
                custodyReleasesInNext7Days: 1,
                paroleReportsInNext28Days: 4,
                otherReportsInNext14Days: 2,
                tierCaseTotals: {
                  untiered: 3,
                  a: 1,
                  b: 4,
                  c: 2,
                  d: 0,
                  as: 1,
                  bs: 0,
                  cs: 2,
                  ds: 0,
                },
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
                licenseCases: 1,
                allocatedCasesPastWeek: 7,
                reallocatedCasesPastWeek: 4,
                ispsDueInNext14Days: 1,
                activeCases: 15,
                contactSuspendedCases: 2,
                custodyReleasesInNext7Days: 1,
                paroleReportsInNext28Days: 2,
                otherReportsInNext14Days: 3,
                tierCaseTotals: {
                  untiered: 0,
                  a: 2,
                  b: 0,
                  c: 3,
                  d: 0,
                  as: 1,
                  bs: 1,
                  cs: 1,
                  ds: 1,
                },
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
                licenseCases: 0,
                allocatedCasesPastWeek: 3,
                reallocatedCasesPastWeek: 1,
                ispsDueInNext14Days: 4,
                activeCases: 8,
                contactSuspendedCases: 1,
                custodyReleasesInNext7Days: 0,
                paroleReportsInNext28Days: 0,
                otherReportsInNext14Days: 1,
                tierCaseTotals: {
                  untiered: 3,
                  a: 0,
                  b: 2,
                  c: 0,
                  d: 2,
                  as: 2,
                  bs: 1,
                  cs: 0,
                  ds: 0,
                },
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
                licenseCases: 0,
                allocatedCasesPastWeek: 11,
                reallocatedCasesPastWeek: 2,
                ispsDueInNext14Days: 0,
                activeCases: 8,
                contactSuspendedCases: 6,
                custodyReleasesInNext7Days: 0,
                paroleReportsInNext28Days: 6,
                otherReportsInNext14Days: 2,
                tierCaseTotals: {
                  untiered: 0,
                  a: 3,
                  b: 6,
                  c: 0,
                  d: 0,
                  as: 2,
                  bs: 2,
                  cs: 1,
                  ds: 0,
                },
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
            combinedName: 'Jane Doe',
          },
          email: 'j.doe@email.co.uk',
          grade: 'PQiP',
          workload: 19,
          casesPastWeek: 2,
          communityCases: 3,
          custodyCases: 5,
          licenseCases: 1,
          allocatedCasesPastWeek: 7,
          reallocatedCasesPastWeek: 4,
          ispsDueInNext14Days: 1,
          activeCases: 15,
          contactSuspendedCases: 2,
          custodyReleasesInNext7Days: 1,
          paroleReportsInNext28Days: 2,
          otherReportsInNext14Days: 3,
          tierCaseTotals: {
            untiered: 0,
            a: 2,
            b: 0,
            c: 3,
            d: 0,
            as: 1,
            bs: 1,
            cs: 1,
            ds: 1,
          },
        },
      ],
      N03F02: [
        {
          code: 'OM2',
          name: {
            forename: 'Sam',
            surname: 'Smam',
            combinedName: 'Sam Smam',
          },
          grade: 'SPO',
          workload: 32,
          casesPastWeek: 5,
          communityCases: 0,
          custodyCases: 5,
          licenseCases: 2,
          allocatedCasesPastWeek: 2,
          reallocatedCasesPastWeek: 2,
          ispsDueInNext14Days: 0,
          activeCases: 7,
          contactSuspendedCases: 0,
          custodyReleasesInNext7Days: 2,
          paroleReportsInNext28Days: 3,
          otherReportsInNext14Days: 1,
          tierCaseTotals: {
            untiered: 1,
            a: 1,
            b: 1,
            c: 3,
            d: 0,
            as: 1,
            bs: 1,
            cs: 1,
            ds: 1,
          },
        },
        {
          code: 'OM3',
          name: {
            forename: 'Jim',
            surname: 'Jam',
            combinedName: 'Jim Jam',
          },
          email: 'j.jam@email.co.uk',
          grade: 'PO',
          workload: 32,
          casesPastWeek: 5,
          communityCases: 0,
          custodyCases: 5,
          licenseCases: 1,
          allocatedCasesPastWeek: 7,
          reallocatedCasesPastWeek: 4,
          ispsDueInNext14Days: 1,
          activeCases: 15,
          contactSuspendedCases: 2,
          custodyReleasesInNext7Days: 1,
          paroleReportsInNext28Days: 2,
          otherReportsInNext14Days: 3,
          tierCaseTotals: {
            untiered: 0,
            a: 2,
            b: 0,
            c: 3,
            d: 0,
            as: 1,
            bs: 1,
            cs: 1,
            ds: 1,
          },
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
                licenseCases: 1,
                allocatedCasesPastWeek: 3,
                reallocatedCasesPastWeek: 3,
                ispsDueInNext14Days: 3,
                activeCases: 8,
                contactSuspendedCases: 4,
                custodyReleasesInNext7Days: 1,
                paroleReportsInNext28Days: 2,
                otherReportsInNext14Days: 1,
                tierCaseTotals: {
                  untiered: 3,
                  a: 6,
                  b: 1,
                  c: 3,
                  d: 0,
                  as: 3,
                  bs: 1,
                  cs: 0,
                  ds: 1,
                },
              },
            ],
          },
        },
      },
    })
  },
}
