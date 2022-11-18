import { SuperAgentRequest } from 'superagent'
import { stubForUserPreference, verifyRequestForUserPreference } from './wiremock'

export default {
  stubUserPreferenceTeams: (teams = ['TM1']): SuperAgentRequest => {
    return stubForUserPreference({
      request: {
        method: 'GET',
        urlPattern: `/users/USER1/preferences/allocation-teams`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          items: teams,
        },
      },
    })
  },
  stubUserPreferenceTeamsError: (): SuperAgentRequest => {
    return stubForUserPreference({
      request: {
        method: 'GET',
        urlPattern: `/users/USER1/preferences/allocation-teams`,
      },
      response: {
        status: 500,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {},
      },
    })
  },
  stubPutUserPreferenceTeams: (teams: string[]): SuperAgentRequest => {
    return stubForUserPreference({
      request: {
        method: 'PUT',
        urlPattern: `/users/USER1/preferences/allocation-teams`,
        bodyPatterns: [
          {
            equalToJson: `{ "items": ${JSON.stringify(teams)}}`,
          },
        ],
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          items: ['TM1', 'TM2'],
        },
      },
    })
  },
  stubPutUserPreferencePDU: (pdus: string[]): SuperAgentRequest => {
    return stubForUserPreference({
      request: {
        method: 'PUT',
        urlPattern: `/users/USER1/preferences/allocation-pdu`,
        bodyPatterns: [
          {
            equalToJson: `{ "items": ${JSON.stringify(pdus)}}`,
          },
        ],
      },
      response: {
        status: 201,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          items: pdus,
        },
      },
    })
  },
  stubUserPreferencePDU: (pdus = ['PDU1']): SuperAgentRequest => {
    return stubForUserPreference({
      request: {
        method: 'GET',
        urlPattern: `/users/USER1/preferences/allocation-pdu`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          items: pdus,
        },
      },
    })
  },
  verifyPutUserPreferenceTeams: (teams: string[]) =>
    verifyRequestForUserPreference({
      requestUrlPattern: `/users/USER1/preferences/allocation-teams`,
      method: 'PUT',
      body: {
        items: teams,
      },
    }),

  verifyPutUserPreferencePDU: (pdus: string[]) =>
    verifyRequestForUserPreference({
      requestUrlPattern: `/users/USER1/preferences/allocation-pdu`,
      method: 'PUT',
      body: {
        items: pdus,
      },
    }),
}
