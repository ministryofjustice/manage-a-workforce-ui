import Page from '../pages/page'
import OfficerViewPage from '../pages/officerView'

context('Allocate', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Officer details visible on page', () => {
    cy.task('stubGetWorkloadDetails')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const officerViewPage = Page.verifyOnPage(OfficerViewPage)
    officerViewPage.captionText().should('contain', 'Wrexham - Team 1')
    officerViewPage.secondaryText().should('contain', 'PO')
  })

  it('Breadcrumbs are visible on page', () => {
    cy.task('stubGetWorkloadDetails')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const officerViewPage = Page.verifyOnPage(OfficerViewPage)
    officerViewPage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case view')
      .and('contain', 'Allocate to probation practitioner')
  })
})
