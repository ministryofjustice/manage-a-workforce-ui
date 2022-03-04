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
    Page.verifyOnPage(OfficerViewPage)
  })
})
