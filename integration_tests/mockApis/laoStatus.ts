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
  stubForStaffLaoStatusByCrn: (): SuperAgentRequest => {
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
  stubForStaffLaoStatusByCrnNotExcluded: (): SuperAgentRequest => {
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
              isExcluded: false,
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
  stubForStaffLaoStatusByCrnExcluded: (): SuperAgentRequest => {
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
              isExcluded: true,
            },
            {
              staffCode: 'OM3',
              isExcluded: true,
            },
          ],
        },
      },
    })
  },
  stubForStaffLaoStatusByCrn2: (): SuperAgentRequest => {
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
