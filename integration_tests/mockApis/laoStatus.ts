import { SuperAgentRequest } from 'superagent'
import { stubForLaoStatus } from './wiremock'

export default {
  stubForLaoStatus: ({ crn, response }): SuperAgentRequest => {
    return stubForLaoStatus({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/${crn}/restricted`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    })
  },
  stubForStaffLaoStatusByCrn: (staffIds: string[]): SuperAgentRequest => {
    return stubForLaoStatus({
      request: {
        method: 'POST',
        urlPattern: `/cases/unallocated/J678910/restrictions`,
        bodyPatterns: [
          {
            equalToJson: `{ "staffCodes": ["OM1", "OM2", "OM3"]}`,
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: '678910',
          staffRestrictions: [
            {
              staffCode: 'OM1',
              isExcluded: true,
            },
            {
              staffCode: 'OM2',
              isExcluded: false,
            },
            {
              staffCode: 'OM3',
              isExcluded: false,
            },
          ],
        },
      },
    })
  },
  stubForStaffLaoStatusByCrn2: (staffIds: string[]): SuperAgentRequest => {
    return stubForLaoStatus({
      request: {
        method: 'POST',
        urlPattern: `/cases/unallocated/J678910/restrictions`,
        bodyPatterns: [
          {
            equalToJson: `{ "staffCodes": ["OM1"]}`,
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: '678910',
          staffRestrictions: [
            {
              staffCode: 'OM1',
              isExcluded: true,
            },
          ],
        },
      },
    })
  },
}
