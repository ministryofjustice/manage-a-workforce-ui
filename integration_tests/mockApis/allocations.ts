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
            sentenceDate: '2021-10-17',
            initialAppointment: `${dayjs().format('YYYY-MM-D')}`,
            status: 'Currently managed',
          },
          {
            name: 'Sofia Mitchell',
            crn: 'L786545',
            tier: 'C1',
            sentenceDate: `${dayjs().format('YYYY-MM-D')}`,
            initialAppointment: null,
            status: 'Previously managed',
            previousConvictionEndDate: '2019-12-13',
          },
          {
            name: 'John Smith',
            crn: 'P125643',
            tier: 'C3',
            sentenceDate: '2021-09-23',
            initialAppointment: '2021-10-15',
            status: 'New to probation',
          },
          {
            name: 'Kacey Ray',
            crn: 'E124321',
            tier: 'C2',
            sentenceDate: '2021-11-23',
            initialAppointment: `${dayjs().add(1, 'day')}`,
            status: 'New to probation',
          },
          {
            name: 'Andrew Williams',
            crn: 'P567654',
            tier: 'C1',
            sentenceDate: '2021-11-26',
            initialAppointment: `${dayjs().add(2, 'day')}`,
            status: 'Previously managed',
          },
          {
            name: 'Sarah Siddall',
            crn: 'C567654',
            tier: 'C2',
            sentenceDate: '2021-11-26',
            initialAppointment: `${dayjs().add(3, 'day')}`,
            status: 'Previously managed',
          },
          {
            name: 'Mick Jones',
            crn: 'C234432',
            tier: 'C1',
            sentenceDate: '2021-11-17',
            initialAppointment: null,
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
      sentenceDate: '2021-10-17',
      initialAppointment: '2021-10-22',
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
