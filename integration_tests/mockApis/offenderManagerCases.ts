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
          name: {
            forename: 'John',
            surname: 'Doe',
            combinedName: 'John Doe',
          },
          email: 'some.email@justice.gov.uk',
          grade: 'PO',
          code: 'OM1',
          activeCases: [
            {
              name: {
                forename: 'Dylan Adam',
                middleName: 'Adam',
                surname: 'Armstrong',
                combinedName: 'Dylan Adam Armstrong',
              },
              crn: 'CRN1111',
              tier: 'B3',
              type: 'CUSTODY',
            },
            {
              name: {
                forename: 'Cindy',
                surname: 'Smith',
                combinedName: 'Cindy Smith',
              },
              crn: 'CRN2222',
              tier: 'A0',
              type: 'LICENSE',
              initialAllocationDate: '2025-05-17',
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
          name: {
            forename: 'John',
            surname: 'Doe',
            combinedName: 'John Doe',
          },
          grade: 'PO',
          code: 'OM1',
          activeCases: [
            {
              name: {
                forename: 'Dylan Adam',
                middleName: 'Adam',
                surname: 'Armstrong',
                combinedName: 'Dylan Adam Armstrong',
              },
              crn: 'CRN1111',
              tier: 'B3',
              type: 'CUSTODY',
            },
            {
              name: {
                forename: 'Cindy',
                surname: 'Smith',
                combinedName: 'Cindy Smith',
              },
              crn: 'CRN2222',
              tier: 'A0',
              type: 'LICENSE',
            },
          ],
        },
      },
    })
  },
}
