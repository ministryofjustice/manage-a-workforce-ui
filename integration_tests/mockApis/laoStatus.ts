import { SuperAgentRequest } from 'superagent'
import { stubForLaoStatus } from './wiremock'

import LaoStatus from '../../server/models/LaoStatus'

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
  stubForStaffLaoStatusByCrns: (crns: LaoStatus[] = []): SuperAgentRequest => {
    const crnStrings = (crns ?? [{ crn: 'CRN1111' }, { crn: 'CRN2222' }]).map(c => c.crn)
    return stubForLaoStatus({
      request: {
        method: 'POST',
        urlPattern: `/cases/restrictions/crn/list`,
        bodyPatterns: [
          {
            equalToJson: `{ "crns": ${JSON.stringify(crnStrings)} }`,
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          access: crns ?? [
            {
              crn: 'CRN1111',
              userRestricted: false,
              userExcluded: false,
            },
            {
              crn: 'CRN2222',
              userRestricted: false,
              userExcluded: false,
            },
          ],
        },
      },
    })
  },
  stubForStaffLaoStatusByCrnsRestricted: (): SuperAgentRequest => {
    return stubForLaoStatus({
      request: {
        method: 'POST',
        urlPattern: `/cases/restrictions/crn/list`,
        bodyPatterns: [
          {
            equalToJson: `{ "crns": ["CRN1111", "CRN2222"]}`,
          },
        ],
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          access: [
            {
              crn: 'CRN1111',
              userRestricted: false,
              userExcluded: true,
            },
            {
              crn: 'CRN2222',
              userRestricted: true,
              userExcluded: false,
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
  stubForGetLaoRestrictions: ({ crn }): SuperAgentRequest => {
    return stubForLaoStatus({
      request: {
        method: 'GET',
        urlPattern: `/cases/${crn}/restrictions`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: '$crn}',
          isRestricted: false,
          isRedacted: false,
        },
      },
    })
  },
  stubForGetLaoRestrictionsExcluded: ({ crn }): SuperAgentRequest => {
    return stubForLaoStatus({
      request: {
        method: 'GET',
        urlPattern: `/cases/${crn}/restrictions`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: '$crn}',
          isRestricted: true,
          isRedacted: false,
        },
      },
    })
  },
  stubForGetLaoRestrictionsRedacted: ({ crn }): SuperAgentRequest => {
    return stubForLaoStatus({
      request: {
        method: 'GET',
        urlPattern: `/cases/${crn}/restrictions`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: '$crn}',
          isRestricted: true,
          isRedacted: true,
        },
      },
    })
  },
}
