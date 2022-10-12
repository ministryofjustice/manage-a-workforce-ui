import { SuperAgentRequest } from 'superagent'
import { stubForProbationEstate } from './wiremock'

export default {
  stubGetTeamsByCodes: ({
    codes,
    response,
  }: {
    codes: string
    response: Record<string, unknown>[]
  }): SuperAgentRequest => {
    return stubForProbationEstate({
      request: {
        method: 'GET',
        urlPattern: `/team/search\\?codes=${codes}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    })
  },
  stubGetTeamDetails: ({ code, name }: { code: string; name: string }): SuperAgentRequest => {
    return stubForProbationEstate({
      request: {
        method: 'GET',
        urlPattern: `/team/${code}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          code,
          name,
          probationDeliveryUnit: {
            code: 'PDU1',
            name: 'A Probation Delivery Unit',
          },
        },
      },
    })
  },
  stubGetPduDetails: (pduCode = 'PDU1'): SuperAgentRequest => {
    return stubForProbationEstate({
      request: {
        method: 'GET',
        urlPattern: `/probationDeliveryUnit/${pduCode}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          code: pduCode,
          name: 'A Probation Delivery Unit',
          region: {
            code: 'RG1',
            name: 'A Region',
          },
          teams: [
            {
              code: 'TM1',
              name: 'A Team',
            },
            {
              code: 'TM4',
              name: 'D Team',
            },
            {
              code: 'TM3',
              name: 'C Team',
            },
            {
              code: 'TM2',
              name: 'B Team',
            },
          ],
        },
      },
    })
  },
  stubGetAllRegions: (): SuperAgentRequest => {
    return stubForProbationEstate({
      request: {
        method: 'GET',
        urlPattern: `/regions`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [
          {
            code: 'RG1',
            name: 'A Region',
          },
          {
            code: 'RG4',
            name: 'D Region',
          },
          {
            code: 'RG3',
            name: 'C Region',
          },
          {
            code: 'RG2',
            name: 'B Region',
          },
        ],
      },
    })
  },
  stubGetRegionDetails: (): SuperAgentRequest => {
    return stubForProbationEstate({
      request: {
        method: 'GET',
        urlPattern: `/region/RG1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          code: 'RG1',
          name: 'A Region',
          probationDeliveryUnits: [
            {
              code: 'PDU1',
              name: 'A Probation Delivery Unit',
            },
            {
              code: 'PDU4',
              name: 'D Probation Delivery Unit',
            },
            {
              code: 'PDU3',
              name: 'C Probation Delivery Unit',
            },
            {
              code: 'PDU2',
              name: 'B Probation Delivery Unit',
            },
          ],
        },
      },
    })
  },
}
