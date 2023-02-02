import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubGetOverview: (teamCode = 'TM2'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/${teamCode}/offenderManagers/OM2`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          forename: 'John',
          surname: 'Doe',
          email: 'some.email@justice.gov.uk',
          grade: 'PO',
          capacity: 126,
          code: 'OM2',
          totalCases: 22,
          weeklyHours: 22.5,
          totalReductionHours: 10,
          pointsAvailable: 1265,
          pointsUsed: 1580,
          pointsRemaining: -315,
          lastUpdatedOn: '2013-11-03T09:00:00',
          nextReductionChange: '2022-11-03T09:00:00Z',
          caseTotals: {
            a: 6,
            b: 10,
            c: 12,
            d: 14,
            untiered: 2,
          },
          paroleReportsDue: 5,
          caseEndDue: 3,
          releasesDue: 6,
        },
      },
    })
  },

  stubGetOverviewUnderCapacity: (teamCode = 'TM2'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/${teamCode}/offenderManagers/OM2`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          forename: 'John',
          surname: 'Doe',
          grade: 'PO',
          capacity: 98,
          code: 'OM2',
          totalCases: 22,
          weeklyHours: 22.5,
          totalReductionHours: 10,
          pointsAvailable: 1265,
          pointsUsed: 1580,
          pointsRemaining: -315,
          lastUpdatedOn: '2013-11-03T09:00:00',
          nextReductionChange: '2022-11-03T09:00:00Z',
          caseTotals: {
            a: 6,
            b: 10,
            c: 12,
            d: 14,
            untiered: 2,
          },
          paroleReportsDue: 1,
        },
      },
    })
  },

  stubGetOverviewWithLastAllocatedEvent: (teamCode = 'TM2'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/${teamCode}/offenderManagers/OM6`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          forename: 'John',
          surname: 'Doe',
          grade: 'PO',
          capacity: 126,
          code: 'OM6',
          totalCases: 22,
          weeklyHours: 22.5,
          totalReductionHours: 10,
          pointsAvailable: 1265,
          pointsUsed: 1580,
          pointsRemaining: -315,
          lastUpdatedOn: '2013-11-03T09:00:00',
          nextReductionChange: '2022-11-03T09:00:00Z',
          caseTotals: {
            a: 6,
            b: 10,
            c: 12,
            d: 14,
            untiered: 2,
          },
          paroleReportsDue: 5,
          caseEndDue: 3,
          releasesDue: 6,
          lastAllocatedEvent: {
            allocatedOn: '2022-08-19T13:07:56.075Z',
            tier: 'A3',
            sentenceType: 'COMMUNITY',
          },
        },
      },
    })
  },
}
