import Page from '../pages/page'
import ProbationRecordPage from '../pages/probationRecord'

context('Probation record', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Caption text visible on page', () => {
    cy.task('stubGetProbationRecord')
    cy.signIn()
    cy.visit('/J678910/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Probation record header visible on page', () => {
    cy.task('stubGetProbationRecord')
    cy.signIn()
    cy.visit('/J678910/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.probationRecordHeading().should('contain', 'Probation record')
  })

  it('Allocate button visible on page', () => {
    cy.task('stubGetProbationRecord')
    cy.signIn()
    cy.visit('/J678910/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.button().should('contain', 'Allocate')
  })

  it('Current order sub-heading visible on page with body text', () => {
    cy.task('stubGetProbationRecord')
    cy.signIn()
    cy.visit('/J678910/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.subHeading().should('contain', 'Current order')
    probationRecordPage.bodyText().should('contain', 'No current orders.')
  })

  it('Previous orders sub-heading visible on page with body text', () => {
    cy.task('stubGetProbationRecord')
    cy.signIn()
    cy.visit('/J678910/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.subHeading().should('contain', 'Previous orders')
    probationRecordPage.bodyText().should('contain', 'No previous orders.')
  })
})
