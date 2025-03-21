import { SuperAgentRequest } from 'superagent'
import { stubForWorkload } from './wiremock'

const teamWorkload = {
  N03F01: {
    teams: [
      {
        code: 'N03A020',
        name: {
          forename: 'Coco',
          surname: 'Pint',
          combinedName: 'Coco Pint',
        },
        email: 'simulate-delivered@notifications.service.gov.uk',
        grade: 'PO',
        workload: 10,
        casesPastWeek: 11,
        communityCases: 1,
        custodyCases: 1,
      },
      {
        code: 'N03A016',
        name: {
          forename: 'Carlo',
          surname: 'Veo',
          combinedName: 'Carlo Veo',
        },
        email: 'carlo.veo@digital.justice.gov.uk',
        grade: 'PO',
        workload: 20,
        casesPastWeek: 12,
        communityCases: 2,
        custodyCases: 2,
      },
      {
        code: 'N01A022',
        name: {
          forename: 'Katie',
          surname: 'Cawthorne',
          combinedName: 'Katie Cawthorne',
        },
        email: 'katie.cawthorne@digital.justice.gov.uk',
        grade: 'PO',
        workload: 30,
        casesPastWeek: 13,
        communityCases: 3,
        custodyCases: 3,
      },
      {
        code: 'N04A135',
        name: {
          forename: 'Test',
          surname: 'User',
          combinedName: 'Test User',
        },
        grade: 'PO',
        workload: 40,
        casesPastWeek: 14,
        communityCases: 4,
        custodyCases: 4,
      },
      {
        code: 'N54A022',
        name: {
          forename: 'AutomatedTestUser',
          surname: 'AutomatedTestUser',
          combinedName: 'AutomatedTestUser AutomatedTestUser',
        },
        email: 'simulate-delivered@notifications.service.gov.uk',
        grade: 'PSO',
        workload: 50,
        casesPastWeek: 15,
        communityCases: 5,
        custodyCases: 5,
      },
      {
        code: 'N07B656',
        name: {
          forename: 'Natalie',
          surname: 'Wood',
          combinedName: 'Natalie Wood',
        },
        email: 'natalie.wood@digital.justice.gov.uk',
        grade: 'PO',
        workload: 60,
        casesPastWeek: 16,
        communityCases: 6,
        custodyCases: 6,
      },
      {
        code: 'N07B743',
        name: {
          forename: 'Paul',
          surname: 'McPhee',
          combinedName: 'Paul McPhee',
        },
        email: 'paul.mcphee@digital.justice.gov.uk',
        grade: 'PO',
        workload: 70,
        casesPastWeek: 17,
        communityCases: 7,
        custodyCases: 7,
      },
      {
        code: 'N03F030',
        name: {
          forename: 'Robert',
          surname: 'King',
          combinedName: 'Robert King',
        },
        email: 'robert.king@digital.justice.gov.uk',
        grade: 'PO',
        workload: 80,
        casesPastWeek: 18,
        communityCases: 8,
        custodyCases: 8,
      },
      {
        code: 'N57A029',
        name: {
          forename: 'Leigh',
          surname: 'Christie',
          combinedName: 'Leigh Christie',
        },
        email: 'leigh.christie@digital.justice.gov.uk',
        grade: 'PO',
        workload: 90,
        casesPastWeek: 19,
        communityCases: 9,
        custodyCases: 9,
      },
      {
        code: 'N03A019',
        name: {
          forename: 'Derek',
          surname: 'Pint',
          combinedName: 'Derek Pint',
        },
        email: 'simulate-delivered-2@notifications.service.gov.uk',
        grade: 'PO',
        workload: 100,
        casesPastWeek: 20,
        communityCases: 10,
        custodyCases: 10,
      },
      {
        code: 'N57A046',
        name: {
          forename: 'Samantha',
          surname: 'Bryant',
          combinedName: 'Samantha Bryant',
        },
        email: 'Samantha.Bryant@digital.justice.gov.uk',
        grade: 'PO',
        workload: 110,
        casesPastWeek: 21,
        communityCases: 11,
        custodyCases: 11,
      },
      {
        code: 'N57A042',
        name: {
          forename: 'Pauline',
          surname: 'Silver',
          combinedName: 'Pauline Silver',
        },
        email: 'pauline.silver@digital.justice.gov.uk',
        grade: 'PO',
        workload: 120,
        casesPastWeek: 22,
        communityCases: 12,
        custodyCases: 12,
      },
      {
        code: 'N57A024',
        name: {
          forename: 'Rose',
          surname: 'Brandle',
          combinedName: 'Rose Brandle',
        },
        email: 'rose.brandle@digital.justice.gov.uk',
        grade: 'PO',
        workload: 130,
        casesPastWeek: 23,
        communityCases: 13,
        custodyCases: 13,
      },
      {
        code: 'N07B290',
        name: {
          forename: 'Andy',
          surname: 'Sweilam',
          combinedName: 'Andy Sweilam',
        },
        email: 'andy.sweilam@digital.justice.gov.uk',
        grade: 'PO',
        workload: 140,
        casesPastWeek: 24,
        communityCases: 14,
        custodyCases: 14,
      },
    ],
  },
}

export default {
  stubForTeamWorkload: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: '/team/practitioner-workloadcases\\?teamCode=.*',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: teamWorkload,
      },
    })
  },
  stubForTeamWorkloadOverCapacity: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: '/team/practitioner-workloadcases\\?teamCode=.*',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          N03F01: {
            teams: teamWorkload.N03F01.teams.map(team => ({ ...team, workload: 150 })),
          },
        },
      },
    })
  },
  stubForTeamWorkloadZeroCapacities: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: '/team/practitioner-workloadcases\\?teamCode=.*',
      },
      response: {
        status: 200,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: {
          N03F01: {
            teams: teamWorkload.N03F01.teams.map((team, index) => ({ ...team, workload: index < 4 ? 0 : 75 })),
          },
        },
      },
    })
  },
}
