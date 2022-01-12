import Page from '../pages/page'
import RiskPage from '../pages/risk'

context('Risk', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Caption text visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    cy.get('a[href*="/risk"]').click()
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Risk header visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    cy.get('a[href*="/risk"]').click()
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.riskHeading().should('contain', 'Risk')
  })

  it('Allocate button visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.button().should('contain', 'Allocate')
  })
})
