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
              tier: 'B',
              type: 'CUSTODY',
            },
            {
              name: {
                forename: 'Cindy',
                surname: 'Smith',
                combinedName: 'Cindy Smith',
              },
              crn: 'CRN2222',
              tier: 'A',
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
              tier: 'B',
              type: 'CUSTODY',
            },
            {
              name: {
                forename: 'Cindy',
                surname: 'Smith',
                combinedName: 'Cindy Smith',
              },
              crn: 'CRN2222',
              tier: 'A',
              type: 'LICENSE',
            },
          ],
        },
      },
    })
  },
  stubGetOffenderManagerCasesForAllTiers: (teamCode = 'TM2'): SuperAgentRequest => {
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
              tier: 'B',
              type: 'CUSTODY',
            },
            {
              name: {
                forename: 'Cindy',
                surname: 'Smith',
                combinedName: 'Cindy Smith',
              },
              crn: 'CRN2222',
              tier: 'A',
              type: 'LICENSE',
            },
            {
              name: {
                forename: 'Sofia',
                surname: 'Mitchell',
                combinedName: 'Sofia Mitchell',
              },
              crn: 'L786545',
              tier: 'C',
              type: 'CUSTODY',
            },
            {
              name: {
                forename: 'Kacey',
                surname: 'Ray',
                combinedName: 'Kacey Ray',
              },
              crn: 'E124321',
              tier: 'E',
              type: 'COMMUNITY',
            },
            {
              name: {
                forename: 'Andrew',
                surname: 'Williams',
                combinedName: 'Andrew Williams',
              },
              crn: 'P567654',
              tier: 'G',
              type: 'COMMUNITY',
            },
            {
              name: {
                forename: 'Sarah',
                surname: 'Siddall',
                combinedName: 'Sarah Siddall',
              },
              crn: 'C567654',
              tier: 'D',
              type: 'COMMUNITY',
            },
            {
              name: {
                forename: 'Bill',
                surname: 'Turner',
                combinedName: 'Bill Turner',
              },
              crn: 'F5635632',
              tier: 'F',
              type: 'COMMUNITY',
            },
            {
              name: {
                forename: 'Daffy',
                surname: 'Duck',
                combinedName: 'Daffy Duck',
              },
              crn: 'X768522',
              tier: '-',
              type: 'CUSTODY',
            },
          ],
        },
      },
    })
  },
}
