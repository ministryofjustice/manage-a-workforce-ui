import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubGetOverview: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/J678910/convictions/123456789/allocate/OM2/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          offenderManagerForename: 'John',
          offenderManagerSurname: 'Doe',
          offenderManagerGrade: 'PO',
          offenderManagerCurrentCapacity: 126,
          offenderManagerCode: 'OM2',
          offenderManagerTotalCases: 22,
          convictionId: 123456789,
          teamName: 'Wrexham - Team 1',
          offenderManagerWeeklyHours: 22.5,
          offenderManagerTotalReductionHours: 10,
          offenderManagerPointsAvailable: 1265,
          offenderManagerPointsUsed: 1580,
          offenderManagerPointsRemaining: -315,
          lastUpdatedOn: '2013-11-03T09:00:00',
          nextReductionChange: '2022-11-03T09:00:00Z',
        },
      },
    })
  },

  stubGetOverviewUnderCapacity: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/J678910/convictions/123456789/allocate/OM2/overview`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          offenderManagerForename: 'John',
          offenderManagerSurname: 'Doe',
          offenderManagerGrade: 'PO',
          offenderManagerCurrentCapacity: 98,
          offenderManagerCode: 'OM2',
          offenderManagerTotalCases: 22,
          convictionId: 123456789,
          teamName: 'Wrexham - Team 1',
          offenderManagerWeeklyHours: 22.5,
          offenderManagerTotalReductionHours: 10,
          offenderManagerPointsAvailable: 1265,
          offenderManagerPointsUsed: 1580,
          offenderManagerPointsRemaining: -315,
          lastUpdatedOn: '2013-11-03T09:00:00',
        },
      },
    })
  },
}
