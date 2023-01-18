import { SuperAgentRequest, Response } from 'superagent'
import { stubForUserPreference, stubForUserPreferenceScenario, verifyRequestForUserPreference } from './wiremock'

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

  stubUserPreferenceAllocationDemand: ({
    pduCode,
    lduCode,
    teamCode,
  }: {
    pduCode: string
    lduCode: string
    teamCode: string
  }): SuperAgentRequest => {
    return stubForUserPreference({
      request: {
        method: 'GET',
        urlPattern: `/users/USER1/preferences/allocation-demand`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          items: [`{"pdu": "${pduCode}", "ldu": "${lduCode}", "team": "${teamCode}"}`],
        },
      },
    })
  },
  stubUserPreferenceEmptyAllocationDemand: (): SuperAgentRequest => {
    return stubForUserPreference({
      request: {
        method: 'GET',
        urlPattern: `/users/USER1/preferences/allocation-demand`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          items: [],
        },
      },
    })
  },

  stubPutUserPreferenceAllocationDemand: ({
    pduCode,
    lduCode,
    teamCode,
  }: {
    pduCode: string
    lduCode: string
    teamCode: string
  }): SuperAgentRequest => {
    return stubForUserPreference({
      request: {
        method: 'PUT',
        urlPattern: `/users/USER1/preferences/allocation-demand`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          items: [`{"pdu": "${pduCode}", "ldu": "${lduCode}", "team": "${teamCode}"}`],
        },
      },
    })
  },

  stubUserPreferencePDUErrorThenSuccess: (): Promise<Array<Response>> => {
    return stubForUserPreferenceScenario([
      {
        scenarioName: 'user preference fails once',
        requiredScenarioState: 'Started',
        newScenarioState: 'failed',
        request: {
          method: 'GET',
          urlPattern: `/users/USER1/preferences/allocation-pdu`,
        },
        response: {
          status: 500,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          jsonBody: {},
        },
      },
      {
        scenarioName: 'user preference fails once',
        requiredScenarioState: 'failed',
        request: {
          method: 'GET',
          urlPattern: `/users/USER1/preferences/allocation-pdu`,
        },
        response: {
          status: 200,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
          jsonBody: {
            items: [],
          },
        },
      },
    ])
  },

  stubPutUserPreferenceTeamsErrorThenSuccess: (teams: []): Promise<Array<Response>> => {
    return stubForUserPreferenceScenario([
      {
        scenarioName: 'put team user preference fails once',
        requiredScenarioState: 'Started',
        newScenarioState: 'failed',
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
          status: 500,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        },
      },
      {
        scenarioName: 'put team user preference fails once',
        requiredScenarioState: 'failed',
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
      },
    ])
  },

  stubPutUserPreferencePDUErrorThenSuccess: (pdus: []): Promise<Array<Response>> => {
    return stubForUserPreferenceScenario([
      {
        scenarioName: 'put pdu user preference fails once',
        requiredScenarioState: 'Started',
        newScenarioState: 'failed',
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
          status: 500,
          headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        },
      },
      {
        scenarioName: 'put pdu user preference fails once',
        requiredScenarioState: 'failed',
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
      },
    ])
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

  verifyPutUserPreferenceAllocationDemand: ({
    pduCode,
    lduCode,
    teamCode,
  }: {
    pduCode: string
    lduCode: string
    teamCode: string
  }) =>
    verifyRequestForUserPreference({
      requestUrlPattern: `/users/USER1/preferences/allocation-demand`,
      method: 'PUT',
      body: {
        items: [`{"pdu": "${pduCode}", "ldu": "${lduCode}", "team": "${teamCode}"}`],
      },
    }),
}
