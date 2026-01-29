import ReviewReallocationsPage from '../../pages/reallocations/reviewReallocations'
import Page from '../../pages/page'
import ChoosePractitionerPage from '../../pages/choosePractitioner'

context('Review reallocation', () => {
  let reviewReallocationsPage: ReviewReallocationsPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetPotentialOffenderManagerWorkload', {})
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAssessmentDate')
    cy.task('stubCrnGetRisk')
    cy.task('stubForFeatureflagEnabled')
    cy.task('stubGetCrnAccess', {
      crn: 'J678910',
      userId: 'USER1',
      allowed: true,
    })

    cy.task('stubGetTeamDetails', {
      code: 'TM1',
      name: 'Wrexham Team 1',
    })

    cy.task('stubGetTeamsByCodes', {
      code: 'TM1',
      response: [{ code: 'TM1', name: 'Team 1' }],
    })

    cy.task('stubChoosePractitioners', {
      teamCodes: ['TM1'],
      crn: 'J678910',
      teams: {
        TM1: [
          {
            code: 'OM3',
            name: { forename: 'Jane', middleName: '', surname: 'Doe' },
            email: 'j.doe@email.co.uk',
            grade: 'PO',
            workload: 19,
            casesPastWeek: 2,
            communityCases: 3,
            custodyCases: 5,
          },
        ],
      },
    })

    cy.task('stubGetPotentialOffenderManagerWorkload', { teamCode: 'TM1', staffCode: 'OM3' })

    cy.signIn()

    cy.visit('/pdu/PDU1/J678910/reallocations/choose-practitioner')

    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tabtable('all-teams').within(() => {
      choosePractitionerPage.radio('TM1::OM3').click()
    })

    cy.get('#reason').select('OFFICER_LEFT')
    choosePractitionerPage.allocateCaseButton().click()

    Page.verifyOnPage(ReviewReallocationsPage)
  })

  it('Reallocating to, from and reason visible on page', () => {
    cy.contains('h1', 'Review reallocation').should('be.visible')

    cy.contains('.govuk-summary-list__key', 'Reallocating from')
      .siblings('.govuk-summary-list__value')
      .should('contain.text', 'Derek Pint')

    cy.contains('.govuk-summary-list__key', 'Reallocating to')
      .siblings('.govuk-summary-list__value')
      .should('contain.text', 'John Doe')

    cy.contains('.govuk-summary-list__key', 'Reallocation reason')
      .siblings('.govuk-summary-list__value')
      .should('contain.text', 'Officer left')
  })

  it('entering link in allocation notes errors', () => {
    cy.get('#reallocationNotes').type('https://bbc.co.uk/noway')
    cy.contains('button', 'Reallocate').click()
    cy.get('.govuk-error-summary').should('exist')
    cy.get('.govuk-error-summary a[href="#reallocationNotes"]').should(
      'contain.text',
      'You cannot include links in the allocation notes',
    )
  })
})
