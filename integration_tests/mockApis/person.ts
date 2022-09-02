import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

export default {
  stubGetPersonById: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: `/allocation/person/3fa85f64-5717-4562-b3fc-2c963f66afa6`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
          staffId: 5678,
          staffCode: 'OM1',
          teamCode: 'N03F01',
          providerCode: 'PR987',
          createdBy: '',
          createdDate: '2022-05-12T11:28:12.389Z',
          crn: 'J678910',
          personName: 'Dylan Adam Armstrong',
          staffGrade: 'PO',
          staffEmail: 'john.doe@test.justice.gov.uk',
          staffForename: 'John',
          staffSurname: 'Doe',
        },
      },
    })
  },
}
