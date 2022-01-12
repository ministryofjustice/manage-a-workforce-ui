import Page from '../pages/page'
import SummaryPage from '../pages/summary'

context('Summary', () => {
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
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Summary header visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.summaryHeading().should('contain', 'Summary')
  })

  it('Sub nav visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.get('a[href*="J678910/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.subNav().should('contain', 'Summary').and('contain', 'Probation record').and('contain', 'Risk')
  })

  it('Allocate button visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.button().should('contain', 'Allocate')
  })
})
