import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubAllocateOffenderManagerToCaseBlank: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/team/TM2/offenderManager/OM1/case`,
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

  stubErrorAllocateOffenderManagerToCase: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/team/TM2/offenderManager/OM1/case`,
        bodyPatterns: [
          {
            equalToJson: `{"crn":"J678910", "instructions": "", "allocationJustificationNotes": "Test", "sensitiveNotes": false, "spoOversightNotes": "Test", "sensitiveOversightNotes": false, "sendEmailCopyToAllocatingOfficer": false, "emailTo": ["first@justice.gov.uk", "second@justice.gov.uk"], "eventNumber": "1", "laoCase": false}`,
          },
        ],
      },
      response: {
        status: 500,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    })
  },

  stub504ErrorAllocateOffenderManagerToCase: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/team/TM2/offenderManager/OM1/case`,
        bodyPatterns: [
          {
            equalToJson: `{"crn":"J678910", "instructions": "", "allocationJustificationNotes": "Test", "sensitiveNotes": false, "spoOversightNotes": "Test", "sensitiveOversightNotes": false, "sendEmailCopyToAllocatingOfficer": false, "emailTo": ["first@justice.gov.uk", "second@justice.gov.uk"], "eventNumber": "1", "laoCase": false}`,
          },
        ],
      },
      response: {
        status: 504,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    })
  },

  stub424ErrorAllocateOffenderManagerToCase: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/team/TM2/offenderManager/OM1/case`,
        bodyPatterns: [
          {
            equalToJson: `{"crn":"J678910", "instructions": "", "allocationJustificationNotes": "Test", "sensitiveNotes": false, "spoOversightNotes": "Test", "sensitiveOversightNotes": false, "sendEmailCopyToAllocatingOfficer": false, "emailTo": ["first@justice.gov.uk", "second@justice.gov.uk"], "eventNumber": "1", "laoCase": false}`,
          },
        ],
      },
      response: {
        status: 424,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    })
  },

  stubAllocateOffenderManagerToCaseMultipleEmails: (sendCopy = false, laoStatus = false): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: '/team/TM2/offenderManager/OM1/case',
        bodyPatterns: [
          {
            equalToJson: `{"crn":"J678910", "instructions": "", "allocationJustificationNotes": "Test", "sensitiveNotes": false, "spoOversightNotes": "Test", "sensitiveOversightNotes": false, "sendEmailCopyToAllocatingOfficer": ${sendCopy}, "emailTo": ["first@justice.gov.uk", "second@justice.gov.uk"], "eventNumber": "1", "laoCase": ${laoStatus}}`,
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

  stubAllocateOffenderManagerToCaseMultipleEmailsNumericEvent: ({ sendCopy, laoStatus }): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: '/team/TM2/offenderManager/OM1/case',
        bodyPatterns: [
          {
            equalToJson: JSON.stringify({
              crn: 'J678910',
              instructions: '',
              emailTo: ['first@justice.gov.uk', 'second@justice.gov.uk'],
              sendEmailCopyToAllocatingOfficer: sendCopy,
              eventNumber: 1,
              allocationJustificationNotes: 'Test',
              sensitiveNotes: false,
              spoOversightNotes: 'Test',
              sensitiveOversightNotes: false,
              laoCase: laoStatus,
            }),
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

  stubGetApostropheAllocationCompleteDetails: (): SuperAgentRequest => {
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
            surname: 'O&#39;Armstrong',
            combinedName: 'Dylan Adam O&#39;Armstrong',
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
