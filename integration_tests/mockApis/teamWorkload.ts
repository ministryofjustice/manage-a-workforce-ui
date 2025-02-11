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
        workload: 0,
        casesPastWeek: 135,
        communityCases: 0,
        custodyCases: 0,
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
        workload: 0,
        casesPastWeek: 1,
        communityCases: 0,
        custodyCases: 0,
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
        workload: 0,
        casesPastWeek: 0,
        communityCases: 0,
        custodyCases: 0,
      },
      {
        code: 'N04A135',
        name: {
          forename: 'Test',
          surname: 'User',
          combinedName: 'Test User',
        },
        grade: 'PO',
        workload: 0,
        casesPastWeek: 0,
        communityCases: 0,
        custodyCases: 0,
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
        workload: 0,
        casesPastWeek: 0,
        communityCases: 0,
        custodyCases: 0,
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
        workload: 0,
        casesPastWeek: 8,
        communityCases: 0,
        custodyCases: 0,
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
        workload: 0,
        casesPastWeek: 0,
        communityCases: 0,
        custodyCases: 0,
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
        workload: 0,
        casesPastWeek: 0,
        communityCases: 0,
        custodyCases: 0,
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
        workload: 0,
        casesPastWeek: 0,
        communityCases: 0,
        custodyCases: 0,
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
        workload: 0,
        casesPastWeek: 0,
        communityCases: 0,
        custodyCases: 0,
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
        workload: 0,
        casesPastWeek: 0,
        communityCases: 0,
        custodyCases: 0,
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
        workload: 0,
        casesPastWeek: 0,
        communityCases: 0,
        custodyCases: 0,
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
        workload: 0,
        casesPastWeek: 0,
        communityCases: 0,
        custodyCases: 0,
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
        workload: 0,
        casesPastWeek: 1,
        communityCases: 0,
        custodyCases: 0,
      },
    ],
  },
}

export default {
  stubForTeamWorkload: (): SuperAgentRequest => {
    return stubForWorkload({
      request: {
        method: 'GET',
        urlPattern: '/team/practitioner-workloadcases\\?teamCode=*',
      },
      response: {
        status: 404,
        headers: { 'Content-Type': 'application/json;charset=UTF-8' },
        jsonBody: teamWorkload,
      },
    })
  },
}
