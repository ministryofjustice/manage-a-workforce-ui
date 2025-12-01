import { SuperAgentRequest } from 'superagent'
import { stubForAllocation } from './wiremock'

export const allocationsByTeamResponse = [
  {
    name: 'Dylan Adam Armstrong',
    crn: 'J678910',
    tier: 'C1',
    sentenceDate: '2021-09-01',
    handoverDate: null,
    initialAppointment: {
      date: '2021-09-01',
      staff: {
        name: {
          forename: 'Unallocated',
          middlename: null,
          surname: 'Staff',
          combinedName: 'Unallocated Staff',
        },
      },
    },
    status: 'Currently managed',
    offenderManager: {
      forenames: 'Antonio',
      surname: 'LoSardo',
      grade: 'SPO',
    },
    convictionNumber: 1,
    caseType: 'COMMUNITY',
    outOfAreaTransfer: false,
  },
  {
    name: 'Sofia Mitchell',
    crn: 'L786545',
    tier: 'C1',
    sentenceDate: '2021-05-10',
    handoverDate: '2025-01-03',
    initialAppointment: null,
    status: 'Previously managed',
    offenderManager: {
      forenames: 'John',
      surname: 'Agard',
    },
    convictionNumber: 2,
    caseType: 'CUSTODY',
    sentenceLength: '5 Years',
    outOfAreaTransfer: false,
  },
  {
    name: 'John Smith',
    crn: 'P125643',
    tier: 'C3',
    sentenceDate: '2023-07-23',
    handoverDate: null,
    initialAppointment: {
      date: '2023-09-01',
      staff: {
        name: {
          forename: 'Reece',
          middlename: 'John',
          surname: 'Spears',
          combinedName: 'Reece John Spears',
        },
      },
    },
    status: 'New to probation',
    convictionNumber: 3,
    caseType: 'COMMUNITY',
    outOfAreaTransfer: false,
  },
  {
    name: 'Kacey Ray',
    crn: 'E124321',
    tier: 'C2',
    sentenceDate: '2022-02-16',
    handoverDate: null,
    initialAppointment: {
      date: '2022-03-25',
      staff: {
        name: {
          forename: 'Micheala',
          middlename: null,
          surname: 'Smith',
          combinedName: 'Micheala Smith',
        },
      },
    },
    status: 'New to probation',
    convictionNumber: 4,
    caseType: 'COMMUNITY',
    outOfAreaTransfer: false,
  },
  {
    name: 'Andrew Williams',
    crn: 'P567654',
    tier: 'C1',
    sentenceDate: '2021-06-01',
    handoverDate: null,
    initialAppointment: {
      date: '2021-06-15',
      staff: {
        name: {
          forename: 'John',
          middlename: 'Paul',
          surname: 'Tinker',
          combinedName: 'John Paul Tinker',
        },
      },
    },
    status: 'Previously managed',
    convictionNumber: 5,
    caseType: 'COMMUNITY',
    outOfAreaTransfer: false,
  },
  {
    name: 'Sarah Siddall',
    crn: 'C567654',
    tier: 'C2',
    sentenceDate: '2024-03-01',
    handoverDate: null,
    initialAppointment: {
      date: '2024-04-25',
      staff: {
        name: {
          forename: 'Lando',
          middlename: null,
          surname: 'Nickson',
          combinedName: 'Lando Nickson',
        },
      },
    },
    status: 'Previously managed',
    convictionNumber: 1,
    caseType: 'COMMUNITY',
    outOfAreaTransfer: false,
  },
  {
    name: 'Mick Jones',
    crn: 'C234432',
    tier: 'C1',
    sentenceDate: '2021-05-25',
    handoverDate: null,
    initialAppointment: null,
    status: 'Previously managed',
    convictionNumber: 6,
    caseType: 'COMMUNITY',
    outOfAreaTransfer: false,
  },
  {
    name: 'Bill Turner',
    crn: 'F5635632',
    tier: 'D1',
    sentenceDate: '2021-05-10',
    handoverDate: null,
    initialAppointment: {
      date: '2021-08-21',
      staff: {
        name: {
          forename: 'Emma',
          middlename: 'Marie',
          surname: 'Williams',
          combinedName: 'Emma Marie Williams',
        },
      },
    },
    status: 'Currently managed',
    offenderManager: {
      forenames: 'Richard',
      surname: 'Moore',
    },
    convictionNumber: 7,
    caseType: 'COMMUNITY',
    outOfAreaTransfer: false,
  },
  {
    name: 'Daffy Duck',
    crn: 'X768522',
    tier: 'C1',
    sentenceDate: '2000-03-01',
    handoverDate: '2024-10-03',
    initialAppointment: null,
    status: 'Previously managed',
    offenderManager: {
      forenames: 'John',
      surname: 'Agard',
    },
    convictionNumber: 2,
    caseType: 'CUSTODY',
    sentenceLength: '25 Years',
    outOfAreaTransfer: false,
  },
  {
    name: 'Paul Daniels',
    crn: 'XX89999',
    tier: 'C1',
    sentenceDate: '2023-05-10',
    handoverDate: null,
    initialAppointment: '2024-04-10',
    status: 'Previously managed',
    offenderManager: {
      forenames: 'John',
      surname: 'Agard',
    },
    convictionNumber: 2,
    caseType: 'LICENSE',
    sentenceLength: '11 months',
    outOfAreaTransfer: false,
  },
]

export default {
  stubGetAllocationsByTeam: ({ teamCode, response = allocationsByTeamResponse }): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/team/${teamCode}/cases/unallocated`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    })
  },
  stubOverOneHundredAllocationsByTeam: (teamCode: string): SuperAgentRequest => {
    const jsonBody = new Array(100).fill(0).map(() => ({
      name: 'Dylan Adam Armstrong',
      crn: 'J678910',
      tier: 'C1',
      sentenceDate: '2021-10-17',
      initialAppointment: {
        date: '2021-10-22',
        staff: {
          name: {
            forename: 'Reece',
            middlename: 'John',
            surname: 'Spears',
            combinedName: 'Reece John Spears',
          },
        },
      },
      status: 'Currently managed',
      convictionNumber: 1,
      caseType: 'COMMUNITY',
    }))
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/team/${teamCode}/cases/unallocated`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody,
      },
    })
  },
  stubGetUnallocatedCase: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          gender: 'Male',
          dateOfBirth: '1984-09-27',
          age: 37,
          offences: [
            {
              mainOffence: true,
              mainCategory: 'Common assault and battery',
              subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
            },
          ],
          expectedSentenceEndDate: '2021-09-28',
          sentenceLength: '6 Months',
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: '100 Hours',
            },
          ],
          pncNumber: 'D/9874483AB',
          courtReport: {
            description: 'Pre-Sentence Report - Fast',
            completedDate: '2022-01-27T10:54:32.868Z',
            documentId: '00000000-0000-0000-0000-000000000000',
            name: 'courtFile.pdf',
          },
          cpsPack: {
            completedDate: '2022-02-27T10:54:32.868Z',
            documentId: '11111111-1111-1111-1111-111111111111',
            name: 'cpsPackFile.pdf',
          },
          preConvictionDocument: {
            completedDate: '2022-03-27T10:54:32.868Z',
            documentId: '22222222-2222-2222-2222-222222222222',
            name: 'preConsFile.pdf',
          },
          assessment: {
            lastAssessedOn: '2022-01-27T10:54:32.869Z',
            type: 'LAYER_3',
          },
          convictionNumber: 1,
          address: {
            addressNumber: '5A',
            buildingName: 'The Building',
            streetName: 'The Street',
            town: 'Reading',
            county: 'Berkshire',
            postcode: 'RG22 3EF',
            noFixedAbode: false,
            typeVerified: true,
            typeDescription: 'Rental accommodation',
            startDate: '2022-08-25',
          },
          roshLevel: 'VERY_HIGH',
          rsrLevel: 'MEDIUM',
          ogrsScore: 85,
          activeRiskRegistration: 'ALT Under MAPPA Arrangements, Suicide/self-harm',
        },
      },
    })
  },
  stubGetAllocatedCase: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/allocated/J678910`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          pncNumber: 'D/9874483AB',
          gender: 'Male',
          dateOfBirth: '1984-09-27',
          age: 37,
          tier: 'C1',
          address: null,
          nextAppointmentDate: null,
          activeEvents: [
            {
              number: 1,
              failureToComplyCount: 0,
              failureToComplyStartDate: '2025-10-15',
              sentence: null,
              offences: [],
              requirements: [],
            },
            {
              number: 2,
              failureToComplyCount: 0,
              failureToComplyStartDate: '2025-10-14',
              sentence: {
                description: 'ORA Community Order',
                startDate: '2025-10-14',
                endDate: '2026-04-13',
                length: '6 Months',
              },
              offences: [
                {
                  mainOffence: true,
                  mainCategory: 'Common assault and battery',
                  subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
                },
              ],
              requirements: [
                {
                  mainCategory: 'Unpaid Work',
                  subCategory: 'Regular',
                  length: '100 Hours',
                },
              ],
            },
          ],
          outOfAreaTransfer: false,
        },
      },
    })
  },
  stubGetAllocatedOutOfAreaCase: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/allocated/J678910`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          pncNumber: 'D/9874483AB',
          gender: 'Male',
          dateOfBirth: '1984-09-27',
          age: 37,
          tier: 'C1',
          address: null,
          nextAppointmentDate: null,
          activeEvents: [
            {
              number: 1,
              failureToComplyCount: 0,
              failureToComplyStartDate: '2025-10-15',
              sentence: null,
              offences: [],
              requirements: [],
            },
            {
              number: 2,
              failureToComplyCount: 0,
              failureToComplyStartDate: '2025-10-14',
              sentence: {
                description: 'ORA Community Order',
                startDate: '2025-10-14',
                endDate: '2026-04-13',
                length: '6 Months',
              },
              offences: [
                {
                  mainOffence: true,
                  mainCategory: 'Common assault and battery',
                  subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
                },
              ],
              requirements: [
                {
                  mainCategory: 'Unpaid Work',
                  subCategory: 'Regular',
                  length: '100 Hours',
                },
              ],
            },
          ],
          outOfAreaTransfer: true,
        },
      },
    })
  },
  stubGetCrnAccess: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/user/USER1/crn/J678910/is-allowed`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {},
      },
    })
  },
  stubGetUnallocatedCaseWhereIsOutOfAreaTransfer: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          gender: 'Male',
          dateOfBirth: '1984-09-27',
          age: 37,
          offences: [
            {
              mainOffence: true,
              mainCategory: 'Common assault and battery',
              subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
            },
          ],
          expectedSentenceEndDate: '2021-09-28',
          sentenceLength: '6 Months',
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: '100 Hours',
            },
          ],
          pncNumber: 'D/9874483AB',
          courtReport: {
            description: 'Pre-Sentence Report - Fast',
            completedDate: '2022-01-27T10:54:32.868Z',
            documentId: '00000000-0000-0000-0000-000000000000',
            name: 'courtFile.pdf',
          },
          cpsPack: {
            completedDate: '2022-02-27T10:54:32.868Z',
            documentId: '11111111-1111-1111-1111-111111111111',
            name: 'cpsPackFile.pdf',
          },
          preConvictionDocument: {
            completedDate: '2022-03-27T10:54:32.868Z',
            documentId: '22222222-2222-2222-2222-222222222222',
            name: 'preConsFile.pdf',
          },
          assessment: {
            lastAssessedOn: '2022-01-27T10:54:32.869Z',
            type: 'LAYER_3',
          },
          convictionNumber: 1,
          address: {
            addressNumber: '5A',
            buildingName: 'The Building',
            streetName: 'The Street',
            town: 'Reading',
            county: 'Berkshire',
            postcode: 'RG22 3EF',
            noFixedAbode: false,
            typeVerified: true,
            typeDescription: 'Rental accommodation',
            startDate: '2022-08-25',
          },
          roshLevel: 'VERY_HIGH',
          rsrLevel: 'MEDIUM',
          ogrsScore: 85,
          activeRiskRegistration: 'ALT Under MAPPA Arrangements, Suicide/self-harm',
          outOfAreaTransfer: true,
        },
      },
    })
  },
  stubGetUnallocatedCaseUnavailableRisk: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          gender: 'Male',
          dateOfBirth: '1984-09-27',
          age: 37,
          offences: [
            {
              mainOffence: true,
              mainCategory: 'Common assault and battery',
              subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
            },
          ],
          expectedSentenceEndDate: '2021-09-28',
          sentenceLength: '6 Months',
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: '100 Hours',
            },
          ],
          pncNumber: 'D/9874483AB',
          courtReport: {
            description: 'Pre-Sentence Report - Fast',
            completedDate: '2022-01-27T10:54:32.868Z',
            documentId: '00000000-0000-0000-0000-000000000000',
            name: 'courtFile.pdf',
          },
          cpsPack: {
            completedDate: '2022-02-27T10:54:32.868Z',
            documentId: '11111111-1111-1111-1111-111111111111',
            name: 'cpsPackFile.pdf',
          },
          preConvictionDocument: {
            completedDate: '2022-03-27T10:54:32.868Z',
            documentId: '22222222-2222-2222-2222-222222222222',
            name: 'preConsFile.pdf',
          },
          assessment: {
            lastAssessedOn: '2022-01-27T10:54:32.869Z',
            type: 'LAYER_3',
          },
          convictionNumber: 1,
          address: {
            addressNumber: '5A',
            buildingName: 'The Building',
            streetName: 'The Street',
            town: 'Reading',
            county: 'Berkshire',
            postcode: 'RG22 3EF',
            noFixedAbode: false,
            typeVerified: true,
            typeDescription: 'Rental accommodation',
            startDate: '2022-08-25',
          },
          roshLevel: 'UNAVAILABLE',
          rsrLevel: 'UNAVAILABLE',
          ogrsScore: null,
          activeRiskRegistration: null,
        },
      },
    })
  },
  stubGetUnallocatedCaseNoRequirements: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          gender: 'Male',
          dateOfBirth: '1984-09-27',
          age: 37,
          offences: [
            {
              mainOffence: true,
              mainCategory: 'Common assault and battery',
              subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
            },
          ],
          expectedSentenceEndDate: '2021-09-28',
          sentenceLength: '6 Months',
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [],
          pncNumber: 'D/9874483AB',
          convictionNumber: 1,
          address: {
            addressNumber: '5A',
            buildingName: 'The Building',
            streetName: 'The Street',
            town: 'Reading',
            county: 'Berkshire',
            postcode: 'RG22 3EF',
            noFixedAbode: false,
            typeVerified: true,
            typeDescription: 'Rental accommodation',
            startDate: '2022-08-25',
          },
          roshLevel: 'UNAVAILABLE',
          rsrLevel: 'UNAVAILABLE',
          ogrsScore: null,
          activeRiskRegistration: null,
        },
      },
    })
  },
  stubGetUnallocatedCaseNotFoundRisk: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          gender: 'Male',
          dateOfBirth: '1984-09-27',
          age: 37,
          offences: [
            {
              mainOffence: true,
              mainCategory: 'Common assault and battery',
              subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
            },
          ],
          expectedSentenceEndDate: '2021-09-28',
          sentenceLength: '6 Months',
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: '100 Hours',
            },
          ],
          pncNumber: 'D/9874483AB',
          courtReport: {
            description: 'Pre-Sentence Report - Fast',
            completedDate: '2022-01-27T10:54:32.868Z',
            documentId: '00000000-0000-0000-0000-000000000000',
            name: 'courtFile.pdf',
          },
          cpsPack: {
            completedDate: '2022-02-27T10:54:32.868Z',
            documentId: '11111111-1111-1111-1111-111111111111',
            name: 'cpsPackFile.pdf',
          },
          preConvictionDocument: {
            completedDate: '2022-03-27T10:54:32.868Z',
            documentId: '22222222-2222-2222-2222-222222222222',
            name: 'preConsFile.pdf',
          },
          assessment: {
            lastAssessedOn: '2022-01-27T10:54:32.869Z',
            type: 'LAYER_3',
          },
          convictionNumber: 1,
          address: {
            addressNumber: '5A',
            buildingName: 'The Building',
            streetName: 'The Street',
            town: 'Reading',
            county: 'Berkshire',
            postcode: 'RG22 3EF',
            noFixedAbode: false,
            typeVerified: true,
            typeDescription: 'Rental accommodation',
            startDate: '2022-08-25',
          },
          roshLevel: 'NOT_FOUND',
          rsrLevel: 'NOT_FOUND',
          ogrsScore: null,
          activeRiskRegistration: null,
        },
      },
    })
  },
  stubNotFoundUnallocatedCase: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1`,
      },
      response: {
        status: 404,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    })
  },
  stubGetUnallocatedCaseInvalidEndDate: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          gender: 'Male',
          dateOfBirth: '1984-09-27',
          age: 37,
          offences: [
            {
              mainOffence: true,
              mainCategory: 'Common assault and battery',
              subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
            },
          ],
          expectedSentenceEndDate: null,
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: '100 Hours',
            },
          ],
          pncNumber: 'D/9874483AB',
          courtReport: {
            code: 'CJF',
            description: 'Fast',
            completedDate: '2022-01-27T10:54:32.868Z',
            documentId: '00000000-0000-0000-0000-000000000000',
          },
          cpsPack: {
            completedDate: '2022-02-27T10:54:32.868Z',
            documentId: '11111111-1111-1111-1111-111111111111',
          },
          preConvictionDocument: {
            completedDate: '2022-03-27T10:54:32.868Z',
            documentId: '22222222-2222-2222-2222-222222222222',
          },
          assessment: {
            lastAssessedOn: '2022-01-27T10:54:32.869Z',
            type: 'LAYER_3',
          },
          convictionNumber: 1,
          address: {
            addressNumber: '5A',
            buildingName: 'The Building',
            streetName: 'The Street',
            town: 'Reading',
            county: 'Berkshire',
            postcode: 'RG22 3EF',
          },
        },
      },
    })
  },

  stubGetUnallocatedCasePreviouslyManaged: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          gender: 'Male',
          dateOfBirth: '1984-09-27',
          age: 37,
          offences: [
            {
              mainOffence: true,
              mainCategory: 'Common assault and battery',
              subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
            },
          ],
          expectedSentenceEndDate: '2021-09-28',
          sentenceLength: '6 Months',
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: '100 Hours',
            },
          ],
          pncNumber: 'D/9874483AB',
          courtReport: {
            code: 'CJF',
            description: 'Fast',
            completedDate: '2022-01-27T10:54:32.868Z',
            documentId: '00000000-0000-0000-0000-000000000000',
          },
          assessment: {
            lastAssessedOn: '2022-01-27T10:54:32.869Z',
            type: 'LAYER_3',
          },
          convictionNumber: 1,
        },
      },
    })
  },

  stubGetUnallocatedCaseNewToProbation: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          gender: 'Male',
          dateOfBirth: '1984-09-27',
          age: 37,
          offences: [
            {
              mainOffence: true,
              mainCategory: 'Common assault and battery',
              subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
            },
          ],
          expectedSentenceEndDate: '2021-09-28',
          sentenceLength: '6 Months',
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: '100 Hours',
            },
          ],
          pncNumber: 'D/9874483AB',
          courtReport: {
            code: 'CJF',
            description: 'Fast',
            completedDate: '2022-01-27T10:54:32.868Z',
            documentId: '00000000-0000-0000-0000-000000000000',
          },
          assessment: {
            lastAssessedOn: '2022-01-27T10:54:32.869Z',
            type: 'LAYER_3',
          },
          convictionNumber: 1,
        },
      },
    })
  },

  stubGetUnallocatedCaseNoOffenderManager: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          gender: 'Male',
          dateOfBirth: '1984-09-27',
          age: 37,
          offences: [
            {
              mainOffence: true,
              mainCategory: 'Common assault and battery',
              subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
            },
          ],
          expectedSentenceEndDate: '2021-09-28',
          sentenceLength: '6 Months',
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: '100 Hours',
            },
          ],
          pncNumber: 'D/9874483AB',
          courtReport: {
            code: 'CJF',
            description: 'Fast',
            completedDate: '2022-01-27T10:54:32.868Z',
            documentId: '00000000-0000-0000-0000-000000000000',
          },
          cpsPack: {
            completedDate: '2022-02-27T10:54:32.868Z',
            documentId: '11111111-1111-1111-1111-111111111111',
          },
          assessment: {
            lastAssessedOn: '2022-01-27T10:54:32.869Z',
            type: 'LAYER_3',
          },
        },
        convictionNumber: 1,
      },
    })
  },

  stubGetUnallocatedCaseMultiOffences: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'L786545',
          tier: 'C1',
          sentenceDate: '2021-09-02',
          gender: 'Female',
          dateOfBirth: '1994-11-17',
          age: 27,
          offences: [
            {
              mainOffence: true,
              mainCategory: 'Common assault and battery',
              subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
            },
            {
              mainCategory: 'Attempt theft from the person of another',
              subCategory: 'Contrary to section 1(1) of the Criminal Attempts Act 1981.',
            },
            {
              mainCategory: 'Assault by beating',
              subCategory: 'Contrary to section 39 of the Criminal Justice Act 1988.',
            },
          ],
          expectedSentenceEndDate: '2021-12-01',
          sentenceLength: '8 Months',
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: '100 Hours',
            },
            {
              mainCategory: 'Rehabilitation Activity Requirement (RAR)',
              subCategory: 'Regular',
              length: '20 Days',
            },
            {
              mainCategory: 'Court - Accredited Programme - Building Better Relationships',
              subCategory: 'Regular',
              length: '20 Days',
            },
          ],
          pncNumber: 'A/8404713BA',
          address: {
            typeDescription: 'Homeless - rough sleeping',
            postcode: 'NF1 1NF',
            startDate: '2022-02-03',
            noFixedAbode: true,
            typeVerified: false,
          },
        },
      },
    })
  },

  stubGetUnallocatedCasesByTeams: ({
    teamCodes = 'TM1',
    response = [
      {
        teamCode: 'TM1',
        caseCount: 10,
      },
    ],
  }: {
    teamCodes: string
    response: Array<Record<string, unknown>>
  }): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/teamCount\\?teams=${teamCodes}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    })
  },

  stubGetDocuments: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/documents`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [
          {
            id: 'efb7a4e8-3f4a-449c-bf6f-b1fc8def3410',
            name: 'cps.pdf',
            relatedTo: {
              type: 'CPSPACK',
              name: 'SA2020 Suspended Sentence Order',
              event: {
                eventType: 'PREVIOUS',
                eventNumber: '2',
                mainOffence: 'Common assault and battery - 10501',
              },
              description: 'Crown Prosecution Service case pack',
            },
            dateCreated: '2021-10-16T15:15:00+01:00',
            sensitive: true,
          },
          {
            id: '6c50048a-c647-4598-8fae-0b84c69ef31a',
            name: 'doc.pdf',
            relatedTo: {
              type: 'COURT_REPORT',
              name: 'Pre-Sentence Report - Fast',
              event: {
                eventType: 'CURRENT',
                eventNumber: '1',
                mainOffence: 'Attempt/Common/Assault of an Emergency Worker   (Act 2018) 00873',
              },
              description: 'Court Report',
            },
            dateCreated: '2021-12-07T15:24:43+01:00',
            sensitive: false,
          },
          {
            id: '626aa1d1-71c6-4b76-92a1-bf2f9250c143',
            name: 'Pre Cons.pdf',
            relatedTo: {
              type: 'PRECONS',
              name: 'Pre Cons',
              description: 'PNC previous convictions',
            },
            dateCreated: '2021-11-17T10:30:00+01:00',
            sensitive: false,
          },
          {
            id: 'd3cb4b29-e2ce-4a9a-af3c-bc89d5e56f6c',
            name: 'OfficeVisitDocument.DOC',
            relatedTo: {
              type: 'CONTACT',
              name: 'Planned Office Visit (NS)',
              event: {
                eventType: 'PREVIOUS',
                eventNumber: '2',
                mainOffence: 'Common assault and battery - 10501',
              },
              description: 'Contact',
            },
            dateCreated: null,
            sensitive: false,
          },
          {
            name: 'documentWithoutId.pdf',
            relatedTo: {
              type: 'CONTACT',
              name: 'Planned Office Visit (NS)',
              event: {
                eventType: 'PREVIOUS',
                eventNumber: '2',
                mainOffence: 'Common assault and battery - 10501',
              },
              description: 'Contact',
            },
            dateCreated: null,
            sensitive: false,
          },
        ],
      },
    })
  },
  stubGetDocumentsEmpty: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/documents`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [],
      },
    })
  },

  stubGetConfirmInstructions: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/confirm-instructions\\?staffCode=OM1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: {
            forename: 'Dylan',
            middleName: 'Adam',
            surname: 'Armstrong',
            combinedName: 'Dylan Adam Armstrong',
          },
          crn: 'J678910',
          tier: 'C1',
          convictionNumber: 1,
          staff: {
            code: 'OM1',
            name: {
              forename: 'John',
              middleName: '',
              surname: 'Doe',
              combinedName: 'John Doe',
            },
            email: 'john.doe@test.justice.gov.uk',
          },
        },
      },
    })
  },
}
