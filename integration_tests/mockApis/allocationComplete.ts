import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubAllocateOffenderManagerToCase: (sendCopy = true): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/team/TM2/offenderManager/OM1/case`,
        bodyPatterns: [
          {
            equalToJson: `{"crn":"J678910", "instructions": "Test", "sendEmailCopyToAllocatingOfficer": ${sendCopy}, "emailTo": [], "eventNumber": 1}`,
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          personManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          eventManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          requirementManagerIds: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        },
      },
    })
  },

  stubAllocateOffenderManagerToCaseWithEvidence: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/team/TM2/offenderManager/OM1/case`,
        bodyPatterns: [
          {
            equalToJson: `{"crn":"J678910","instructions":"","emailTo":["example.one@justice.gov.uk","example.two@justice.gov.uk"],"sendEmailCopyToAllocatingOfficer":false,"eventNumber":1,"allocationJustificationNotes":"Test","sensitiveNotes":false,"spoOversightNotes":"Test","sensitiveOversightNotes":false}`,
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          personManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          eventManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          requirementManagerIds: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        },
      },
    })
  },

  stubAllocateOffenderManagerToCaseWithEvidence2: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/team/TM2/offenderManager/OM1/case`,
        bodyPatterns: [
          {
            equalToJson: `{"crn":"J678910","instructions":"","emailTo":["example.one@justice.gov.uk","example.two@justice.gov.uk"],"sendEmailCopyToAllocatingOfficer":false,"eventNumber":"1","allocationJustificationNotes":"Test","sensitiveNotes":false,"spoOversightNotes":"Test","sensitiveOversightNotes":false}`,
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          personManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          eventManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          requirementManagerIds: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        },
      },
    })
  },
  stubErrorAllocateOffenderManagerToCase: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/team/TM2/offenderManager/OM1/case`,
        bodyPatterns: [
          {
            equalToJson: `{"crn":"J678910", "instructions": "Test", "sendEmailCopyToAllocatingOfficer": true, "emailTo": [], "eventNumber": 1}`,
          },
        ],
      },
      response: {
        status: 500,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    })
  },

  stubAllocateOffenderManagerToCaseMultipleEmails: (sendCopy = false): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: '/team/TM2/offenderManager/OM1/case',
        bodyPatterns: [
          {
            equalToJson: `{"crn":"J678910", "instructions": "", "allocationJustificationNotes": "Test", "sensitiveNotes": false, "spoOversightNotes": "Test", "sensitiveOversightNotes": false, "sendEmailCopyToAllocatingOfficer": ${sendCopy}, "emailTo": ["example.one@justice.gov.uk", "example.two@justice.gov.uk"], "eventNumber": "1"}`,
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          personManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          eventManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          requirementManagerIds: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        },
      },
    })
  },

  stubAllocateOffenderManagerToCaseMultipleEmails2: (sendCopy = false): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: '/team/TM2/offenderManager/OM1/case',
        bodyPatterns: [
          {
            equalToJson: ` {"crn":"J678910","instructions":"","emailTo":["example.one@justice.gov.uk","example.two@justice.gov.uk"],"sendEmailCopyToAllocatingOfficer":false,"eventNumber": "1","allocationJustificationNotes":"Test","sensitiveNotes":false,"spoOversightNotes":"Test","sensitiveOversightNotes":false}`,
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          personManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          eventManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          requirementManagerIds: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        },
      },
    })
  },

  stubAllocateOffenderManagerToCaseMultipleEmails3: (sendCopy = false): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: '/team/TM2/offenderManager/OM1/case',
        bodyPatterns: [
          {
            equalToJson: ` {"crn":"J678910","instructions":"","emailTo":["example.one@justice.gov.uk","example.two@justice.gov.uk"],"sendEmailCopyToAllocatingOfficer":false,"eventNumber": 1,"allocationJustificationNotes":"Test","sensitiveNotes":false,"spoOversightNotes":"Test","sensitiveOversightNotes":false}`,
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          personManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          eventManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          requirementManagerIds: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        },
      },
    })
  },

  stubAllocateOffenderManagerToCaseWithoutEdit: (sendCopy = false): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: '/team/TM2/offenderManager/OM1/case',
        bodyPatterns: [
          {
            equalToJson: `{"crn":"J678910", "instructions": "", "allocationJustificationNotes": "Test", "sensitiveNotes": false, "spoOversightNotes": "Test", "sensitiveOversightNotes": false, "sendEmailCopyToAllocatingOfficer": ${sendCopy}, "emailTo": [], "eventNumber": 1, "isSPOOversightAccessed": false}`,
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          personManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          eventManagerId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          requirementManagerIds: ['3fa85f64-5717-4562-b3fc-2c963f66afa6'],
        },
      },
    })
  },
  stubGetAllocationCompleteDetails: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: '/allocation/person/J678910/event/1/complete-details',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: 'J678910',
          name: {
            forename: 'Dylan',
            middleName: 'Adam',
            surname: 'Armstrong',
            combinedName: 'Dylan Adam Armstrong',
          },
          type: 'COMMUNITY',
          initialAppointment: {
            date: '2021-09-01',
          },
          staff: {
            code: 'OM1',
            name: {
              forename: 'John',
              middleName: '',
              surname: 'Doe',
              combinedName: 'John Doe',
            },
            email: 'john.doe@test.justice.gov.uk',
            grade: 'PO',
          },
        },
      },
    })
  },

  stubGetAllocationCompleteDetailsNoInitialAppointment: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: '/allocation/person/J678910/event/1/complete-details',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: 'J678910',
          name: {
            forename: 'Dylan',
            middleName: 'Adam',
            surname: 'Armstrong',
            combinedName: 'Dylan Adam Armstrong',
          },
          type: 'COMMUNITY',
          staff: {
            code: 'OM1',
            name: {
              forename: 'John',
              middleName: '',
              surname: 'Doe',
              combinedName: 'John Doe',
            },
            email: 'john.doe@test.justice.gov.uk',
            grade: 'PO',
          },
        },
      },
    })
  },
  stubGetAllocationCompleteDetailsCustody: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: '/allocation/person/J678910/event/1/complete-details',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: 'J678910',
          name: {
            forename: 'Dylan',
            middleName: 'Adam',
            surname: 'Armstrong',
            combinedName: 'Dylan Adam Armstrong',
          },
          type: 'CUSTODY',
          initialAppointment: {
            date: '2024-10-01',
          },
          staff: {
            code: 'OM1',
            name: {
              forename: 'John',
              middleName: '',
              surname: 'Doe',
              combinedName: 'John Doe',
            },
            email: 'john.doe@test.justice.gov.uk',
            grade: 'PO',
          },
        },
      },
    })
  },
  stubGetAllocationCompleteDetailsLicense: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: '/allocation/person/J678910/event/1/complete-details',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: 'J678910',
          name: {
            forename: 'Dylan',
            middleName: 'Adam',
            surname: 'Armstrong',
            combinedName: 'Dylan Adam Armstrong',
          },
          type: 'LICENSE',
          initialAppointment: {
            date: '2024-11-05',
          },
          staff: {
            code: 'OM1',
            name: {
              forename: 'John',
              middleName: '',
              surname: 'Doe',
              combinedName: 'John Doe',
            },
            email: 'john.doe@test.justice.gov.uk',
            grade: 'PO',
          },
        },
      },
    })
  },
}
