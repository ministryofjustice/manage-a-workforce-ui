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
        convictionNumber: 1,
        caseType: 'COMMUNITY',
      },
      {
        name: 'Sofia Mitchell',
        crn: 'L786545',
        tier: 'C1',
        sentenceDate: '2021-09-01',
        initialAppointment: null,
        status: 'Previously managed',
        offenderManager: {
          forenames: 'John',
          surname: 'Agard',
        },
        convictionNumber: 2,
        caseType: 'CUSTODY',
        sentenceLength: '32 Years',
      },
      {
        name: 'John Smith',
        crn: 'P125643',
        tier: 'C3',
        sentenceDate: '2021-07-23',
        initialAppointment: '2021-08-17',
        status: 'New to probation',
        convictionNumber: 3,
        caseType: 'COMMUNITY',
      },
      {
        name: 'Kacey Ray',
        crn: 'E124321',
        tier: 'C2',
        sentenceDate: '2021-09-01',
        initialAppointment: '2021-09-02',
        status: 'New to probation',
        convictionNumber: 4,
        caseType: 'COMMUNITY',
      },
      {
        name: 'Andrew Williams',
        crn: 'P567654',
        tier: 'C1',
        sentenceDate: '2021-09-01',
        initialAppointment: '2021-09-03',
        status: 'Previously managed',
        convictionNumber: 5,
        caseType: 'COMMUNITY',
      },
      {
        name: 'Sarah Siddall',
        crn: 'C567654',
        tier: 'C2',
        sentenceDate: '2021-09-01',
        initialAppointment: '2021-09-04',
        status: 'Previously managed',
        convictionNumber: 1,
        caseType: 'COMMUNITY',
      },
      {
        name: 'Mick Jones',
        crn: 'C234432',
        tier: 'C1',
        sentenceDate: '2021-08-25',
        initialAppointment: null,
        status: 'Previously managed',
        convictionNumber: 6,
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
        convictionNumber: 7,
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
          sentenceLength: '6 Months',
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
            type: {
              description: 'Rental accommodation',
            },
            from: '2022-08-25',
          },
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
          sentenceLength: '6 Months',
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
          sentenceLength: '6 Months',
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
          sentenceLength: '6 Months',
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
          sentenceLength: '8 Months',
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
          address: {
            type: {
              description: 'Homeless - rough sleeping',
            },
            postcode: 'NF1 1NF',
            from: '2022-02-03',
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
}
