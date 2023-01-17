import FindUnallocatedPage from '../pages/findUnallocatedCases'
import Page from '../pages/page'

context('Submit find Unallocated cases', () => {
  let findUnallocatedCasesPage: FindUnallocatedPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
    cy.visit('/probationDeliveryUnit/PDU1/find-unallocated')
    findUnallocatedCasesPage = Page.verifyOnPage(FindUnallocatedPage)
  })

  it('must show error banner when submitting no selections', () => {
    findUnallocatedCasesPage.saveViewButton().click()
    findUnallocatedCasesPage
      .errorSummary()
      .trimTextContent()
      .should(
        'contain',
        'There is a problem Select a Probation Delivery Unit Select a Local Delivery Unit Select a team'
      )
  })
})
