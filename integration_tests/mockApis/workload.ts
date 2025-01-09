import { SuperAgentRequest } from 'superagent'
import { stubForWorkload, verifyRequestForWorkload } from './wiremock'

export default {
  stubWorkloadCases: ({
    teamCodes,
    response,
  }: {
    teamCodes: string
    response: Record<string, unknown>[]
  }): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/workloadcases\\?teams=${teamCodes}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: response,
      },
    })
  },
  stubGetEventManagerDetails: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: '/allocation/person/J678910/event/1/details',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          tier: 'A3',
          personOnProbationFirstName: 'Sally',
          personOnProbationSurname: 'Smith',
        },
      },
    })
  },
  stubNotFoundEventManagerDetails: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: '/allocation/person/J678910/event/1/details',
      },
      response: {
        status: 404,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      },
    })
  },
  stubCaseAllocationHistory: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/allocation/events/teams\\?since=.*`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          cases: [
            {
              crn: 'X602047',
              name: {
                forename: 'Stacy',
                middleName: '',
                surname: 'Koepp',
                combinedName: 'Stacy Koepp',
              },
              staff: {
                code: 'N04A123',
                name: {
                  forename: 'Steve',
                  surname: 'Leave',
                  combinedName: 'Steve Leave',
                },
                grade: 'PO',
              },
              tier: 'C1',
              allocatedOn: '2023-02-02T11:49:35.844055Z',
              allocatingSpo: 'N04A124',
              teamCode: 'TM1',
            },
            {
              crn: 'X602070',
              name: {
                forename: 'Terrance',
                middleName: '',
                surname: 'Yundt',
                combinedName: 'Terrance Yundt',
              },
              staff: {
                code: 'N07B456',
                name: {
                  forename: 'Andy',
                  surname: 'Pandy',
                  combinedName: 'Andy Pandy',
                },
                grade: 'PO',
              },
              tier: 'D0',
              allocatedOn: '2023-03-03T13:23:15.008829Z',
              allocatingSpo: 'N04A124',
              teamCode: 'TM1',
            },
            {
              crn: 'X456123',
              name: {
                forename: 'John',
                middleName: '',
                surname: 'Smith',
                combinedName: 'John Smith',
              },
              staff: {
                code: 'N04A123',
                name: {
                  forename: 'Steve',
                  surname: 'Leave',
                  combinedName: 'Steve Leave',
                },
                grade: 'PO',
              },
              tier: 'C1',
              allocatedOn: '2023-02-02T11:49:35.844055Z',
              allocatingSpo: 'N04A124',
              teamCode: 'TM1',
            },
          ],
        },
      },
    })
  },
  stubCaseAllocationHistoryEmpty: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/allocation/events/teams\\?since=.*`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          cases: [],
        },
      },
    })
  },
  stubCaseAllocationHistoryCountEmpty: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/allocation/events/teams/count\\?since=.*`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          caseCount: 20,
        },
      },
    })
  },
  stubOverOneHundredCaseAllocationHistory: (): SuperAgentRequest => {
    const cases = new Array(100).fill(0).map(() => ({
      crn: 'X602070',
      name: {
        forename: 'Terrance',
        middleName: '',
        surname: 'Yundt',
        combinedName: 'Terrance Yundt',
      },
      staff: {
        code: 'N07B456',
        name: {
          forename: 'Andy',
          surname: 'Pandy',
          combinedName: 'Andy Pandy',
        },
        grade: 'PO',
      },
      tier: 'D0',
      allocatedOn: '2023-03-03T13:23:15.008829Z',
      allocatingSpo: 'N04A124',
      teamCode: 'TM1',
    }))
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/allocation/events/teams\\?since=.*`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          cases,
        },
      },
    })
  },
  stubCaseAllocationHistoryCount: (caseCount = 8): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'POST',
        urlPattern: `/allocation/events/teams/count\\?since=.*`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          caseCount,
        },
      },
    })
  },
  verifyAllocationHistoryRequest: (sinceDate: string) =>
    verifyRequestForWorkload({
      requestUrlPattern: `/events/me\\?since=${sinceDate}T.*`,
      method: 'POST',
    }),
}
