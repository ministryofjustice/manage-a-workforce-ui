import { SuperAgentRequest } from 'superagent'
import { stubForAllocation } from './wiremock'

export default {
  stubGetSavedEmails: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: '/user/USER1/savedEmails',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: ['first@justice.gov.uk', 'second@justice.gov.uk', 'third@justice.gov.uk'],
      },
    })
  },
  stubGetSavedEmailsError: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: '/user/USER1/savedEmails',
      },
      response: {
        status: 500,
      },
    })
  },
  stubPostSavedEmail: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'POST',
        urlPattern: '/user/savedEmails',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          userId: 'USER1',
          email: 'first@justice.gov.uk',
        },
      },
    })
  },
  stubDeleteSavedEmail: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'DELETE',
        urlPattern: '/user/savedEmails',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          userId: 'USER1',
          email: 'first@justice.gov.uk',
        },
      },
    })
  },
}
