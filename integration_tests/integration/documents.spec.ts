import Page from '../pages/page'
import DocumentsPage from '../pages/documents'

context('Documents', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/documents')
  })

  it('Caption text visible on page', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Risk header visible on page', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.documentsHeading().should('contain', 'Documents')
  })

  it('Continue button visible on page', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.button().should('contain', 'Continue')
  })

  it('Instructions text should display', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.instructionsTextArea().should('exist')
  })
})
