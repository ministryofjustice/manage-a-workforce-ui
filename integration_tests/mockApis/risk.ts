import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubGetRisk: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/risks`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          activeRegistrations: [
            {
              type: 'Suicide/self-harm',
              registered: '2020-12-13',
              nextReviewDate: '2022-06-13',
              notes: 'Previous suicide /self-harm attempt. Needs further investigating.',
            },
            {
              type: 'Child concerns',
              registered: '2020-12-13',
              nextReviewDate: '2022-03-13',
              notes: 'Awaiting outcome of social services enquiry.',
            },
            {
              type: 'Medium RoSH',
              registered: '2021-11-09',
              nextReviewDate: '2022-05-09',
              notes: null,
            },
          ],
          inactiveRegistrations: [
            {
              type: 'Domestic abuse perpetrator',
              registered: '2012-06-14',
              endDate: '2019-11-26',
              notes: null,
            },
            {
              type: 'Mental health issues',
              registered: '2017-12-13',
              endDate: '2019-06-13',
              notes: null,
            },
          ],
        },
      },
    })
  },
  stubGetRiskNoRegistrations: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/risks`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          activeRegistrations: [],
          inActiveRegistrations: [],
        },
      },
    })
  },
}
