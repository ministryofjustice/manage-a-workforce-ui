import Page from '../pages/page'
import ReallocationCaseViewPage from '../pages/reallocationCaseView'

context('Reallocation summary', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAssessmentDate')
    cy.task('stubGetAllocatedRiskV1')
    cy.task('stubGetCrnAccess', {
      crn: 'J678910',
      userId: 'USER1',
      allowed: true,
    })

    cy.signIn()

    cy.visit('/pdu/PDU1/J678910/reallocation-case-view')
  })

  it('should display orange tag for provisional tier', () => {
    cy.task('stubGetAllocatedCase', { provisionalTier: true })
    cy.reload()

    const reallocationCaseViewPage = Page.verifyOnPage(ReallocationCaseViewPage)
    reallocationCaseViewPage.popHeader().should('be.visible')
    reallocationCaseViewPage
      .popHeader()
      .within(() => cy.get('.govuk-body.govuk-tag--orange').should('be.visible').and('contain.text', 'Provisional'))

    reallocationCaseViewPage.appSummaryCard().should('be.visible')
    reallocationCaseViewPage
      .appSummaryCard()
      .eq(0)
      .get('.govuk-summary-list__row')
      .eq(0)
      .within(() => cy.get('.govuk-body.govuk-tag--orange').should('be.visible').and('contain.text', 'Provisional'))
  })

  it('should display red tag for missing tier', () => {
    cy.task('stubGetAllocatedCase', { tier: 'MISSING' })
    cy.reload()

    const reallocationCaseViewPage = Page.verifyOnPage(ReallocationCaseViewPage)
    reallocationCaseViewPage.popHeader().should('be.visible')
    reallocationCaseViewPage
      .popHeader()
      .within(() => cy.get('.govuk-body.govuk-tag--red').should('be.visible').and('contain.text', 'Missing'))

    reallocationCaseViewPage.appSummaryCard().should('be.visible')
    reallocationCaseViewPage
      .appSummaryCard()
      .eq(0)
      .get('.govuk-summary-list__row')
      .eq(0)
      .within(() => cy.get('.govuk-body.govuk-tag--red').should('be.visible').and('contain.text', 'Missing'))
  })
})
