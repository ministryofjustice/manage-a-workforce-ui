import { SuperAgentRequest } from 'superagent'
import { stubForAllocation } from './wiremock'

export default {
  stubCrnLookup: ({ crn }: { crn: string }): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/allocated/crn/${crn}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: 'A123456',
          name: {
            forename: 'Jane',
            middleName: '',
            surname: 'Doe',
            combinedName: 'Jane Doe',
          },
          dateOfBirth: '1958-05-25',
          manager: {
            code: 'T35T1NG',
            name: {
              forename: 'Unallocated',
              middleName: '',
              surname: 'Staff',
              combinedName: 'Unallocated Staff',
            },
            teamCode: 'T35T1NG',
            grade: null,
            allocated: false,
          },
          hasActiveOrder: true,
        },
      },
    })
  },
  stubExcludedCrnLookup: ({ crn }: { crn: string }): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/allocated/crn/${crn}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: 'A123456',
          excluded: true,
          apopExcluded: true,
          name: {
            forename: 'Jane',
            middleName: '',
            surname: 'Doe',
            combinedName: 'Jane Doe',
          },
          dateOfBirth: '1958-05-25',
          manager: {
            code: 'T35T1NG',
            name: {
              forename: 'Unallocated',
              middleName: '',
              surname: 'Staff',
              combinedName: 'Unallocated Staff',
            },
            teamCode: 'T35T1NG',
            grade: null,
            allocated: false,
          },
          hasActiveOrder: true,
        },
      },
    })
  },
  stubLaoCrnLookup: ({ crn }: { crn: string }): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/allocated/crn/${crn}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: 'A123456',
          excluded: true,
          apopExcluded: false,
          name: {
            forename: 'Jane',
            middleName: '',
            surname: 'Doe',
            combinedName: 'Jane Doe',
          },
          dateOfBirth: '1958-05-25',
          manager: {
            code: 'T35T1NG',
            name: {
              forename: 'Unallocated',
              middleName: '',
              surname: 'Staff',
              combinedName: 'Unallocated Staff',
            },
            teamCode: 'T35T1NG',
            grade: null,
            allocated: false,
          },
          hasActiveOrder: true,
        },
      },
    })
  },
  stubOoaCrnLookup: ({ crn }: { crn: string }): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/allocated/crn/${crn}`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          crn: 'A123456',
          outOfAreaTransfer: true,
          name: {
            forename: 'Jane',
            middleName: '',
            surname: 'Doe',
            combinedName: 'Jane Doe',
          },
          dateOfBirth: '1958-05-25',
          manager: {
            code: 'T35T1NG',
            name: {
              forename: 'Unallocated',
              middleName: '',
              surname: 'Staff',
              combinedName: 'Unallocated Staff',
            },
            teamCode: 'T35T1NG',
            grade: null,
            allocated: false,
          },
          hasActiveOrder: true,
        },
      },
    })
  },
}
