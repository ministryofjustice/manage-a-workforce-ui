import { SuperAgentRequest } from 'superagent'
import { stubForAllocation } from './wiremock'

import Risk from '../../server/models/Risk'

const activeRegistrations = [
  {
    type: 'Suicide/self-harm',
    registered: '2020-12-13',
    nextReviewDate: '2022-06-13',
    notes: 'Previous suicide /self-harm attempt. Needs further investigating.',
    flag: {
      description: 'RoSH',
    },
  },
  {
    type: 'Child concerns',
    registered: '2020-12-13',
    nextReviewDate: '2022-03-13',
    notes: 'Awaiting outcome of social services enquiry.',
    flag: {
      description: 'Alerts',
    },
  },
  {
    type: 'Medium RoSH',
    registered: '2021-11-09',
    nextReviewDate: '2022-05-09',
    notes: null,
    flag: {
      description: 'Safeguarding',
    },
  },
]

const inactiveRegistrations = [
  {
    type: 'Domestic abuse perpetrator',
    registered: '2012-06-14',
    endDate: '2019-11-26',
    notes: null,
    flag: {
      description: 'Information',
    },
  },
  {
    type: 'Mental health issues',
    registered: '2017-12-13',
    endDate: '2019-06-13',
    notes: null,
    flag: {
      description: 'Public protection',
    },
  },
]

const riskV1: Risk = {
  name: 'Dylan Adam Armstrong',
  crn: 'J678910',
  tier: 'C1',
  completedDate: '2025-12-01T09:11:59',
  riskVersion: '1',
  activeRegistrations,
  inactiveRegistrations,
  convictionNumber: 1,
  laoCase: false,
  risk: {
    roshRisk: {
      overallRisk: 'VERY_HIGH',
      assessedOn: '2025-12-01',
      riskInCommunity: {
        Children: 'VERY_HIGH',
        Public: 'VERY_HIGH',
        'Known Adult': 'VERY_HIGH',
        Staff: 'VERY_HIGH',
      },
    },
    groupReconvictionScore: {
      oneYear: 15,
      twoYears: 26,
      scoreLevel: 'LOW',
    },
    riskOfSeriousRecidivismScore: {
      percentageScore: 8.47,
      staticOrDynamic: 'DYNAMIC',
      source: 'OASYS',
      algorithmVersion: '5',
      scoreLevel: 'HIGH',
    },
  },
}

const riskV2: Risk = {
  name: 'Dylan Adam Armstrong',
  crn: 'J678910',
  tier: 'C1',
  completedDate: '2025-12-01T09:11:59',
  riskVersion: '2',
  activeRegistrations,
  inactiveRegistrations,
  convictionNumber: 1,
  laoCase: false,
  risk: {
    roshRisk: {
      overallRisk: 'VERY_HIGH',
      assessedOn: '2026-01-22',
      riskInCommunity: {
        Public: 'LOW',
        'Known Adult': 'MEDIUM',
        Staff: 'VERY_HIGH',
        Children: 'HIGH',
      },
    },
    allReoffendingPredictor: {
      staticOrDynamic: 'DYNAMIC',
      score: 15.99,
      band: 'MEDIUM',
    },
    combinedSeriousReoffendingPredictor: {
      algorithmVersion: '6',
      staticOrDynamic: 'DYNAMIC',
      score: 0.55,
      band: 'HIGH',
    },
  },
}

export default {
  stubGetRiskV1: (overrides): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/risks`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          ...riskV1,
          ...overrides,
        },
      },
    })
  },
  stubGetRiskV2: (overrides): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/risks`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          ...riskV2,
          ...overrides,
        },
      },
    })
  },
  stubGetAllocatedRiskV1: (overrides): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/allocated/J678910/risks`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          ...riskV1,
          ...overrides,
        },
      },
    })
  },
}
