import { SuperAgentRequest } from 'superagent'
import dayjs from 'dayjs'
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
            initialAppointment: `${dayjs().format('D MMM YYYY')}`,
            status: 'Currently managed',
          },
          {
            name: 'Sofia Mitchell',
            crn: 'L786545',
            tier: 'C1',
            sentenceDate: '31 October 2021',
            initialAppointment: null,
            status: 'Previously managed',
          },
          {
            name: 'John Smith',
            crn: 'P125643',
            tier: 'C3',
            sentenceDate: '23 September 2021',
            initialAppointment: '15 October 2021',
            status: 'New to probation',
          },
          {
            name: 'Kacey Ray',
            crn: 'E124321',
            tier: 'C2',
            sentenceDate: '23 November 2021',
            initialAppointment: `${dayjs().add(1, 'day')}`,
            status: 'New to probation',
          },
          {
            name: 'Andrew Williams',
            crn: 'P567654',
            tier: 'C1',
            sentenceDate: '26 November 2021',
            initialAppointment: `${dayjs().add(2, 'day')}`,
            status: 'Previously managed',
          },
          {
            name: 'Sarah Siddall',
            crn: 'C567654',
            tier: 'C2',
            sentenceDate: '26 November 2021',
            initialAppointment: `${dayjs().add(3, 'day')}`,
            status: 'Previously managed',
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
