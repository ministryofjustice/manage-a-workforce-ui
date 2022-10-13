import { SuperAgentRequest } from 'superagent'
import { stubForAllocation } from './wiremock'

export default {
  stubGetCurrentlyManagedCaseOverview: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/123456789/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          initialAppointment: '2021-09-01',
          status: 'Currently managed',
          offenderManager: {
            forenames: 'Antonio',
            surname: 'LoSardo',
            grade: 'SPO',
          },
          convictionId: 123456789,
          caseType: 'COMMUNITY',
        },
      },
    })
  },

  stubGetCaseOverviewNoInitialAppointment: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/123456789/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          initialAppointment: '',
          status: 'Currently managed',
          offenderManager: {
            forenames: 'Antonio',
            surname: 'LoSardo',
            grade: 'SPO',
          },
          convictionId: 123456789,
          caseType: 'COMMUNITY',
        },
      },
    })
  },

  stubGetCaseOverviewCustodyCase: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/123456789/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          initialAppointment: '',
          status: 'Currently managed',
          offenderManager: {
            forenames: 'Antonio',
            surname: 'LoSardo',
            grade: 'SPO',
          },
          convictionId: 123456789,
          caseType: 'CUSTODY',
        },
      },
    })
  },

  stubGetCurrentlyManagedNoOffenderManagerCaseOverview: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/123456789/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          initialAppointment: '2021-09-01',
          status: 'Currently managed',
          convictionId: 123456789,
          caseType: 'COMMUNITY',
        },
      },
    })
  },

  stubGetPreviouslyManagedNoOffenderManagerCaseOverview: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/123456789/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          initialAppointment: '2021-09-01',
          status: 'Previously managed',
          convictionId: 123456789,
          caseType: 'COMMUNITY',
        },
      },
    })
  },

  stubGetPreviouslyManagedCaseOverview: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/123456789/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          initialAppointment: '2021-09-01',
          status: 'Previously managed',
          offenderManager: {
            forenames: 'Sofia',
            surname: 'Micheals',
            grade: 'PO',
          },
          convictionId: 123456789,
          caseType: 'COMMUNITY',
        },
      },
    })
  },

  stubGetNewToProbationCaseOverview: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions/123456789/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          sentenceDate: '2021-09-01',
          initialAppointment: '2021-09-01',
          status: 'New to probation',
          convictionId: 123456789,
          caseType: 'COMMUNITY',
        },
      },
    })
  },
}
