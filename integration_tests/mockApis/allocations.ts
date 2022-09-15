import { SuperAgentRequest } from 'superagent'
import { stubForAllocation } from './wiremock'

export default {
  stubGetAllocationsByTeam: ({
    teamCode,
    response = [
      {
        name: 'Dylan Adam Armstrong',
        crn: 'J678910',
        tier: 'C1',
        sentenceDate: '2021-09-01',
        initialAppointment: '2021-09-01',
        status: 'Currently managed',
        offenderManager: {
          forenames: 'Antonio',
          surname: 'LoSardo',
          grade: 'SPO',
        },
        convictionId: 123456789,
        caseType: 'COMMUNITY',
      },
      {
        name: 'Sofia Mitchell',
        crn: 'L786545',
        tier: 'C1',
        sentenceDate: '2021-09-01',
        initialAppointment: null,
        status: 'Previously managed',
        previousConvictionEndDate: '2019-12-13',
        convictionId: 56789,
        caseType: 'CUSTODY',
      },
      {
        name: 'John Smith',
        crn: 'P125643',
        tier: 'C3',
        sentenceDate: '2021-07-23',
        initialAppointment: '2021-08-17',
        status: 'New to probation',
        convictionId: 74534,
        caseType: 'COMMUNITY',
      },
      {
        name: 'Kacey Ray',
        crn: 'E124321',
        tier: 'C2',
        sentenceDate: '2021-09-01',
        initialAppointment: '2021-09-02',
        status: 'New to probation',
        convictionId: 268452,
        caseType: 'COMMUNITY',
      },
      {
        name: 'Andrew Williams',
        crn: 'P567654',
        tier: 'C1',
        sentenceDate: '2021-09-01',
        initialAppointment: '2021-09-03',
        status: 'Previously managed',
        convictionId: 7314214,
        caseType: 'COMMUNITY',
      },
      {
        name: 'Sarah Siddall',
        crn: 'C567654',
        tier: 'C2',
        sentenceDate: '2021-09-01',
        initialAppointment: '2021-09-04',
        status: 'Previously managed',
        convictionId: 834124,
        caseType: 'COMMUNITY',
      },
      {
        name: 'Mick Jones',
        crn: 'C234432',
        tier: 'C1',
        sentenceDate: '2021-08-25',
        initialAppointment: null,
        status: 'Previously managed',
        convictionId: 24436547,
        caseType: 'COMMUNITY',
      },
      {
        name: 'Bill Turner',
        crn: 'F5635632',
        tier: 'D1',
        sentenceDate: '2021-09-01',
        initialAppointment: '2021-09-01',
        status: 'Currently managed',
        offenderManager: {
          forenames: 'Richard',
          surname: 'Moore',
        },
        convictionId: 7362532,
        caseType: 'COMMUNITY',
      },
    ],
  }): SuperAgentRequest => {
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
      initialAppointment: '2021-10-22',
      status: 'Currently managed',
      convictionId: 123456789,
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
        urlPattern: `/cases/unallocated/J678910/convictions/123456789`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          initialAppointment: '2021-09-01',
          status: 'Currently managed',
          offenderManager: {
            forenames: 'Antonio',
            surname: 'LoSardo',
            grade: 'SPO',
          },
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
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: 100,
              lengthUnit: 'Hours',
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
          convictionId: 123456789,
          caseType: 'COMMUNITY',
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
  stubGetUnallocatedCaseInvalidEndDate: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/123456789`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          initialAppointment: '2021-09-01',
          status: 'Currently managed',
          offenderManager: {
            forenames: 'Antonio',
            surname: 'LoSardo',
            grade: 'SPO',
          },
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
              length: 100,
              lengthUnit: 'Hours',
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
          convictionId: 123456789,
          caseType: 'COMMUNITY',
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
        urlPattern: `/cases/unallocated/J678910/convictions/123456789`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          initialAppointment: '2021-09-01',
          status: 'Previously managed',
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
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: 100,
              lengthUnit: 'Hours',
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
          convictionId: 123456789,
          caseType: 'COMMUNITY',
        },
      },
    })
  },

  stubGetUnallocatedCaseNewToProbation: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/123456789`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          initialAppointment: '2021-09-01',
          status: 'New to probation',
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
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: 100,
              lengthUnit: 'Hours',
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
          convictionId: 123456789,
          caseType: 'COMMUNITY',
        },
      },
    })
  },

  stubGetUnallocatedCaseNoOffenderManager: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/123456789`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          initialAppointment: '2021-09-01',
          status: 'Currently managed',
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
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: 100,
              lengthUnit: 'Hours',
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
        convictionId: 123456789,
        caseType: 'COMMUNITY',
      },
    })
  },

  stubGetUnallocatedCaseMultiOffences: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/123456789`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'L786545',
          tier: 'C1',
          sentenceDate: '2021-09-02',
          initialAppointment: '2021-09-01',
          status: 'Previously managed',
          offenderManager: {
            forenames: 'Sarah',
            surname: 'Banks',
          },
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
          sentenceDescription: 'SA2020 Suspended Sentence Order',
          requirements: [
            {
              mainCategory: 'Unpaid Work',
              subCategory: 'Regular',
              length: 100,
              lengthUnit: 'Hours',
            },
            {
              mainCategory: 'Rehabilitation Activity Requirement (RAR)',
              subCategory: 'Regular',
              length: 20,
              lengthUnit: 'Days',
            },
            {
              mainCategory: 'Court - Accredited Programme - Building Better Relationships',
              subCategory: 'Regular',
              length: 20,
              lengthUnit: 'Days',
            },
          ],
          pncNumber: 'A/8404713BA',
          convictionId: 56789,
          caseType: 'COMMUNITY',
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
}
