import Page from '../pages/page'
import ChoosePractitionerPage from '../pages/choosePractitioner'
import SummaryPage from '../pages/summary'
import { sortDataAndAssertSortExpectations } from './helper/sort-helper'

context('Choose Practitioner', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubUserPreferenceTeams', ['N03F01', 'N03F02'])
    cy.task('stubForLaoStatus', { crn: 'J678910', response: true })
    cy.task('stubGetUnallocatedCasesByTeams', {
      teamCodes: 'N03F01,N03F02',
      response: [
        {
          teamCode: 'N03F01',
          caseCount: 4,
        },
        {
          teamCode: 'N03F02',
          caseCount: 6,
        },
      ],
    })
    cy.task('stubWorkloadCases', {
      teamCodes: 'N03F01,N03F02',
      response: [
        {
          teamCode: 'N03F01',
          totalCases: 3,
          workload: 77,
        },
        {
          teamCode: 'N03F02',
          totalCases: 3,
          workload: 77,
        },
      ],
    })
    cy.task('stubGetTeamsByCodes', {
      codes: 'N03F01,N03F02',
      response: [
        {
          code: 'N03F01',
          name: 'Team 1',
        },
        {
          code: 'N03F02',
          name: 'Team 2',
        },
      ],
    })
    cy.task('stubForStaffLaoStatusByCrn')
    cy.task('stubForStaffLaoStatusByCrn2')
  })

  it('notification banner is not visible on page if all practitioner have email addresses', () => {
    cy.task('stubChoosePractitionersWithEmails')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const regionPage = Page.verifyOnPage(ChoosePractitionerPage)
    regionPage
      .notificationBanner()
      .should(
        'not.contain',
        'If you cannot allocate to a probation practitioner, it’s because their email address is not linked to their staff code in NDelius.'
      )
  })

  it('show radio button for users with email', () => {
    cy.task('stubChoosePractitioners', {})
    cy.task('stubForStaffLaoStatusByCrnNotExcluded')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tabtable('all-teams').within(() => {
      choosePractitionerPage.radio('N03F02::OM3').should('exist')
      choosePractitionerPage.radio('N03F01::OM1').should('exist')
    })
  })

  it('Should not show radio button if user OM1 is lao excluded', () => {
    cy.task('stubChoosePractitioners', {})
    cy.task('stubForStaffLaoStatusByCrn')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tabtable('all-teams').within(() => {
      choosePractitionerPage.radio('N03F02::OM3').should('exist')
      choosePractitionerPage.radio('N03F01::OM1').should('not.exist')
    })
  })

  it('Should not show radio button if user is lao excluded all', () => {
    cy.task('stubChoosePractitioners', {})
    cy.task('stubForStaffLaoStatusByCrnExcluded')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tabtable('all-teams').within(() => {
      choosePractitionerPage.radio('N03F02::OM3').should('not.exist')
      choosePractitionerPage.radio('N03F01::OM1').should('not.exist')
    })
  })
})
