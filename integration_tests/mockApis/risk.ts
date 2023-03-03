import { SuperAgentRequest } from 'superagent'
import { stubForAllocation } from './wiremock'

export default {
  stubGetRisk: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/risks`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          activeRegistrations: [
            {
              type: 'Suicide/self-harm',
              registered: '2020-12-13',
              nextReviewDate: '2022-06-13',
              notes: 'Previous suicide /self-harm attempt. Needs further investigating.',
            },
            {
              type: 'Child concerns',
              registered: '2020-12-13',
              nextReviewDate: '2022-03-13',
              notes: 'Awaiting outcome of social services enquiry.',
            },
            {
              type: 'Medium RoSH',
              registered: '2021-11-09',
              nextReviewDate: '2022-05-09',
              notes: null,
            },
          ],
          inactiveRegistrations: [
            {
              type: 'Domestic abuse perpetrator',
              registered: '2012-06-14',
              endDate: '2019-11-26',
              notes: null,
            },
            {
              type: 'Mental health issues',
              registered: '2017-12-13',
              endDate: '2019-06-13',
              notes: null,
            },
          ],
          roshRisk: {
            overallRisk: 'VERY_HIGH',
            assessedOn: '2022-10-07T13:11:50',
            riskInCommunity: {
              Staff: 'VERY_HIGH',
              Public: 'HIGH',
              Children: 'LOW',
              'Known Adult': 'MEDIUM',
            },
          },
          rsr: {
            level: 'MEDIUM',
            lastUpdatedOn: '2019-02-12',
            percentage: 3.8,
          },
          ogrs: {
            lastUpdatedOn: '2018-11-17',
            score: 85,
          },
          convictionNumber: 1,
        },
      },
    })
  },
  stubGetNotFoundRisk: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/risks`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          activeRegistrations: [],
          inactiveRegistrations: [],
          roshRisk: {
            overallRisk: 'NOT_FOUND',
            riskInCommunity: {},
          },
          rsr: {
            level: 'NOT_FOUND',
            percentage: -2147483648,
          },
          convictionNumber: 1,
        },
      },
    })
  },
  stubGetRiskNoRegistrations: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/risks`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          activeRegistrations: [],
          inActiveRegistrations: [],
          roshRisk: {
            overallRisk: 'NOT_FOUND',
            riskInCommunity: {},
          },
          rsr: {
            level: 'NOT_FOUND',
            percentage: -2147483648,
          },
          convictionNumber: 1,
        },
      },
    })
  },

  stubGetUnavailableRisk: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/risks`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          activeRegistrations: [],
          inActiveRegistrations: [],
          roshRisk: {
            overallRisk: 'UNAVAILABLE',
            riskInCommunity: {},
          },
          rsr: {
            level: 'UNAVAILABLE',
            percentage: -2147483648,
          },
          convictionNumber: 1,
        },
      },
    })
  },
}
