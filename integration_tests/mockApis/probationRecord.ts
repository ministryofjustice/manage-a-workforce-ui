import { SuperAgentRequest } from 'superagent'
import { stubFor } from './wiremock'

export default {
  stubGetProbationRecord: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          active: [
            {
              description: 'Adult Custody < 12m',
              length: 6,
              lengthUnit: 'Months',
              startDate: '2019-11-17',
              offenderManager: {
                name: 'Sheila Linda Hancock',
                grade: 'PSO',
              },
              offences: [
                {
                  description: 'Abstracting electricity - 04300',
                  mainOffence: true,
                },
              ],
            },
            {
              description: 'ORA Community Order',
              length: 18,
              lengthUnit: 'Months',
              startDate: '2020-11-05',
              offenderManager: {
                name: 'Faraz Haynes',
                grade: 'PO',
              },
              offences: [
                {
                  description: 'Common assault and battery - 10501',
                  mainOffence: true,
                },
              ],
            },
          ],
          previous: [
            {
              description: 'Fine',
              length: 0,
              endDate: '2018-06-23',
              offenderManager: {
                name: 'Sheila Linda Hancock',
                grade: 'PSO',
              },
              offences: [
                {
                  description: 'Abstracting electricity - 04300',
                  mainOffence: true,
                },
              ],
            },
            {
              description: 'ORA Community Order',
              length: 18,
              lengthUnit: 'Months',
              endDate: '2020-11-05',
              offenderManager: {
                name: 'Faraz Haynes',
                grade: 'PO',
              },
              offences: [
                {
                  description: 'Common assault and battery - 10501',
                  mainOffence: true,
                },
              ],
            },
          ],
        },
      },
    })
  },
  stubGetProbationRecordNoConvictions: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          active: [],
          previous: [],
        },
      },
    })
  },
  stubGetProbationRecordMultipleOffences: (): SuperAgentRequest => {
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          active: [
            {
              description: 'Adult Custody < 12m',
              length: 6,
              lengthUnit: 'Months',
              startDate: '2019-11-17',
              offenderManager: {
                name: 'Sheila Linda Hancock',
                grade: 'PSO',
              },
              offences: [
                {
                  description: 'Common assault and battery - 10501',
                  mainOffence: false,
                },
                {
                  description: 'Abstracting electricity - 04300',
                  mainOffence: true,
                },
              ],
            },
          ],
          previous: [
            {
              description: 'Adult Custody < 12m',
              length: 6,
              lengthUnit: 'Months',
              endDate: '2018-06-23',
              offenderManager: {
                name: 'Sheila Linda Hancock',
                grade: 'PSO',
              },
              offences: [
                {
                  description: 'Abstracting electricity - 04300',
                  mainOffence: true,
                },
                {
                  description: 'Common assault and battery - 10501',
                  mainOffence: false,
                },
              ],
            },
          ],
        },
      },
    })
  },
  stubGetManyPreviousProbationRecord: (): SuperAgentRequest => {
    const previousOrders = new Array(100).fill(0).map(() => ({
      description: 'Adult Custody < 12m',
      length: 6,
      lengthUnit: 'Months',
      endDate: '2018-06-23',
      offenderManager: {
        name: 'Sheila Linda Hancock',
        grade: 'PSO',
      },
      offences: [
        {
          description: 'Abstracting electricity - 04300',
          mainOffence: true,
        },
        {
          description: 'Common assault and battery - 10501',
          mainOffence: false,
        },
      ],
    }))
    return stubFor({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/convictions`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          active: [
            {
              description: 'Adult Custody < 12m',
              length: 6,
              lengthUnit: 'Months',
              startDate: '2019-11-17',
              offenderManager: {
                name: 'Sheila Linda Hancock',
                grade: 'PSO',
              },
              offences: [
                {
                  description: 'Common assault and battery - 10501',
                  mainOffence: false,
                },
                {
                  description: 'Abstracting electricity - 04300',
                  mainOffence: true,
                },
              ],
            },
          ],
          previous: previousOrders,
        },
      },
    })
  },
}
