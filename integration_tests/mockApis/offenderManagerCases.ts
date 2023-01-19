import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubGetOffenderManagerCases: (teamCode = 'TM2'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/${teamCode}/offenderManagers/OM2/cases`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          forename: 'John',
          surname: 'Doe',
          email: 'some.email@justice.gov.uk',
          grade: 'PO',
          code: 'OM1',
          teamName: 'Wrexham - Team 1',
          activeCases: [
            {
              forename: 'Dylan Adam',
              surname: 'Armstrong',
              crn: 'CRN1111',
              tier: 'B3',
              caseCategory: 'CUSTODY',
            },
            {
              forename: 'Cindy',
              surname: 'Smith',
              crn: 'CRN2222',
              tier: 'A0',
              caseCategory: 'LICENSE',
            },
            {
              crn: 'CRN3333',
              tier: 'C2',
              caseCategory: 'COMMUNITY',
            },
          ],
        },
      },
    })
  },
  stubGetOffenderManagerCasesNoEmail: (teamCode = 'TM2'): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/team/${teamCode}/offenderManagers/OM2/cases`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          forename: 'John',
          surname: 'Doe',
          grade: 'PO',
          code: 'OM1',
          teamName: 'Wrexham - Team 1',
          activeCases: [
            {
              forename: 'Dylan Adam',
              surname: 'Armstrong',
              crn: 'CRN1111',
              tier: 'B3',
              caseCategory: 'CUSTODY',
            },
            {
              forename: 'Cindy',
              surname: 'Smith',
              crn: 'CRN2222',
              tier: 'A0',
              caseCategory: 'LICENSE',
            },
            {
              crn: 'CRN3333',
              tier: 'C2',
              caseCategory: 'COMMUNITY',
            },
          ],
        },
      },
    })
  },
}
