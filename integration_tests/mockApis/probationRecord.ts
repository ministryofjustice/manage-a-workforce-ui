import { SuperAgentRequest } from 'superagent'
import { stubForAllocation } from './wiremock'

export default {
  stubGetProbationRecord: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/record/exclude-conviction/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          convictionNumber: 1,
          active: [
            {
              description: 'Adult Custody < 12m',
              length: '6 Months',
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
              length: '18 Months',
              startDate: '2020-11-05',
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
              length: '18 Months',
              endDate: '2020-11-05',
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
  stubGetProbationApostropheRecord: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/record/exclude-conviction/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'John O&#39;Reilly',
          crn: 'J678910',
          tier: 'C1',
          convictionNumber: 1,
          active: [
            {
              description: 'Adult Custody < 12m',
              length: '6 Months',
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
              length: '18 Months',
              startDate: '2020-11-05',
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
              length: '18 Months',
              endDate: '2020-11-05',
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
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/record/exclude-conviction/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          convictionNumber: 1,
          active: [],
          previous: [],
        },
      },
    })
  },
  stubGetProbationRecordMultipleOffences: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/record/exclude-conviction/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          convictionNumber: 1,
          active: [
            {
              description: 'Adult Custody < 12m',
              length: '6 Months',
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
              length: '6 Months',
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
      length: '6 Months',
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
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/unallocated/J678910/record/exclude-conviction/1`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          convictionNumber: 1,
          active: [
            {
              description: 'Adult Custody < 12m',
              length: '6 Months',
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
  stubGetAllocatedProbationRecord: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/allocated/J678910/record/exclude-conviction/2`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          convictionNumber: 1,
          active: [
            {
              description: 'Adult Custody < 12m',
              length: '6 Months',
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
              length: '18 Months',
              startDate: '2020-11-05',
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
              length: '18 Months',
              endDate: '2020-11-05',
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
  stubGetAllocatedProbationApostropheRecord: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/allocated/J678910/record/exclude-conviction/2`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'John O&#39;Reilly',
          crn: 'J678910',
          tier: 'C1',
          convictionNumber: 1,
          active: [
            {
              description: 'Adult Custody < 12m',
              length: '6 Months',
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
              length: '18 Months',
              startDate: '2020-11-05',
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
              length: '18 Months',
              endDate: '2020-11-05',
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
  stubGetAllocatedProbationRecordNoConvictions: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/allocated/J678910/record/exclude-conviction/2`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          convictionNumber: 1,
          active: [],
          previous: [],
        },
      },
    })
  },
  stubGetAllocatedProbationRecordMultipleOffences: (): SuperAgentRequest => {
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/allocated/J678910/record/exclude-conviction/2`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          convictionNumber: 1,
          active: [
            {
              description: 'Adult Custody < 12m',
              length: '6 Months',
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
              length: '6 Months',
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
  stubGetManyPreviousAllocatedProbationRecord: (): SuperAgentRequest => {
    const previousOrders = new Array(100).fill(0).map(() => ({
      description: 'Adult Custody < 12m',
      length: '6 Months',
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
    return stubForAllocation({
      request: {
        method: 'GET',
        urlPattern: `/cases/allocated/J678910/record/exclude-conviction/2`,
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          name: 'Dylan Adam Armstrong',
          crn: 'J678910',
          tier: 'C1',
          convictionNumber: 1,
          active: [
            {
              description: 'Adult Custody < 12m',
              length: '6 Months',
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
