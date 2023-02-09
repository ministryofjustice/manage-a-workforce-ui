import { SuperAgentRequest } from 'superagent'
import { stubForAllocation } from './wiremock'

export default {
  stubGetCurrentlyManagedCaseOverview: (convictionId = '123456789'): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/${convictionId}/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          initialAppointment: '2021-09-01',
          convictionId: 123456789,
          caseType: 'COMMUNITY',
          convictionNumber: 1,
        },
      },
    })
  },

  stubGetCaseOverviewNoInitialAppointment: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          initialAppointment: '',
          convictionId: 123456789,
          caseType: 'COMMUNITY',
          convictionNumber: 1,
        },
      },
    })
  },

  stubGetCaseOverviewCustodyCase: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/1/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          initialAppointment: '',
          convictionId: 123456789,
          caseType: 'CUSTODY',
          convictionNumber: 1,
        },
      },
    })
  },
}
