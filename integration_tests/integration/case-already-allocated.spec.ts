import Page from '../pages/page'
import CaseAlreadyAllocated from '../pages/caseAlreadyAllocated'
import NotFoundPage from '../pages/notFound'

context('Case Already Allocated', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubNotFoundUnallocatedCase')
    cy.task('stubGetEventManagerDetails')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view', { failOnStatusCode: false })
  })
  it('Caption Text visible on page', () => {
    const caseAlreadyAllocated = Page.verifyOnPage(CaseAlreadyAllocated)
    caseAlreadyAllocated.captionText().should('contain', 'Tier: A3').and('contain', 'CRN: J678910')
  })

  it('return link goes back to unallocated cases by team page', () => {
    const caseAlreadyAllocated = Page.verifyOnPage(CaseAlreadyAllocated)
    caseAlreadyAllocated.link().should('exist').and('contain', 'Return to unallocated cases')
    caseAlreadyAllocated.link().should('have.attr', 'href').and('include', '/pdu/PDU1/find-unallocated')
  })

  it('body text must indicate case already allocated', () => {
    const caseAlreadyAllocated = Page.verifyOnPage(CaseAlreadyAllocated)
    caseAlreadyAllocated.bodyText().should('have.text', 'This case has already been allocated')
  })

  it('must go to not found page if case is not allocated', () => {
    cy.task('stubNotFoundEventManagerDetails')
    cy.reload()
    Page.verifyOnPage(NotFoundPage)
  })
})
