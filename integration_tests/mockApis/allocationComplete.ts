import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubAllocateOffenderManagerToCase: (teamCode = 'TM1'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/team/${teamCode}/offenderManager/OM1/case`,
        bodyPatterns: [
          {
            equalToJson:
              '{"crn":"J678910", "eventId": 123456789, "instructions": "Test", "sendEmailCopyToAllocatingOfficer": true, "emailTo": []}',
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

  stubAllocateOffenderManagerToCaseMultipleEmails: (teamCode = 'TM1'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/team/${teamCode}/offenderManager/OM1/case`,
        bodyPatterns: [
          {
            equalToJson:
              '{"crn":"J678910", "eventId": 123456789, "instructions": "Test", "sendEmailCopyToAllocatingOfficer": false, "emailTo": ["example.admin@justice.gov.uk", "example.admin@justice.gov.uk"]}',
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
}
