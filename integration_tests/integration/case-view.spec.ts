import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import CaseViewPage from '../pages/caseView'

context('Unallocated', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    const authPage = new AuthSignInPage()
    authPage.checkOnPage()
  })

  it('Sub nav visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.get('a[href*="J678910/case-view"]').click()
    const caseViewPage = Page.verifyOnPage(CaseViewPage)
    caseViewPage.subNav().should('contain', 'Summary').and('contain', 'Probation record').and('contain', 'Risk')
  })

  it('Personal details visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.get('a[href*="J678910/case-view"]').click()
    const caseViewPage = Page.verifyOnPage(CaseViewPage)
    caseViewPage.personalDetailsTitle().should('have.text', 'Personal details')
    cy.get('#personal-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      Name: 'Dylan Adam Armstrong',
      Gender: 'Male',
      'Date of birth': '27 Sep 1984 (37 years old)',
    })
  })
})
