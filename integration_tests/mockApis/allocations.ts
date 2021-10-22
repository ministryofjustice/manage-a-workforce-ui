import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubGetAllocations: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [
          {
            name: 'Dylan Adam Armstrong',
            crn: 'J678910',
            tier: 'C1',
            sentenceDate: '17 October 2021',
            initialAppointment: '22 October 2021',
            status: 'Currently managed',
          },
        ],
      },
    })
  },
  stubOverOneHundredAllocations: (): SuperAgentRequest => {
    const jsonBody = new Array(100).fill(0).map(() => ({
      name: 'Dylan Adam Armstrong',
      crn: 'J678910',
      tier: 'C1',
      sentenceDate: '17 October 2021',
      initialAppointment: '22 October 2021',
      status: 'Currently managed',
    }))
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody,
      },
    })
  },
  stubGetNoAllocations: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: [],
      },
    })
  },
}
