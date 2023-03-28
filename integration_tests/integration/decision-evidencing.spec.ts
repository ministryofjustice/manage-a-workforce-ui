import Page from '../pages/page'
import DecisionEvidencingPage from '../pages/decisionEvidencing'

context('Decision Evidencing', () => {
  let decisionEvidencingPage: DecisionEvidencingPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetPotentialOffenderManagerWorkload', {})
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM2/decision-evidencing')
    decisionEvidencingPage = Page.verifyOnPage(DecisionEvidencingPage)
  })

  it('Offender details visible on page', () => {
    decisionEvidencingPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Section break is visible on page', () => {
    decisionEvidencingPage.sectionBreak().should('exist')
  })

  it('Sub heading is visible on page', () => {
    decisionEvidencingPage.subHeading().should('have.text', "Explain why you're allocating this case to John Doe (PO)")
  })

  it('Breadcrumbs visible on page', () => {
    decisionEvidencingPage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case details')
      .and('contain', 'Choose practitioner')
      .and('contain', 'Allocate to practitioner')
  })

  it('Continue button visible on page', () => {
    decisionEvidencingPage.button().should('exist').and('have.text', '\n  Continue\n')
  })

  it('Cancel link visible on page', () => {
    decisionEvidencingPage.link().should('exist').and('contain', 'Cancel')
    decisionEvidencingPage
      .link()
      .should('have.attr', 'href')
      .and('include', '/pdu/PDU1/J678910/convictions/1/choose-practitioner')
  })
})
