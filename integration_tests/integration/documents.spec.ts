import Page from '../pages/page'
import DocumentsPage from '../pages/documents'

context('Documents', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.task('stubGetDocuments')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/documents')
  })

  it('Caption text visible on page', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('header visible on page', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.documentsHeading().should('contain', 'Documents')
  })

  it('Sub nav visible on page', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage
      .subNav()
      .should('contain', 'Summary')
      .and('contain', 'Probation record')
      .and('contain', 'Risk')
      .and('contain', 'Documents')
  })

  it('Documents tab is highlighted', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.highlightedTab().should('contain.text', 'Documents')
  })

  it('Continue button visible on page', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.button().should('contain', 'Continue')
  })

  it('Instructions text should display', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.instructionsTextArea().should('exist')
  })

  it('Documents table visible on page', () => {
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          Name: 'doc.pdfCourt Report',
          Type: 'Pre-Sentence Report - Fast',
          Event: 'CurrentAttempt/Common/Assault of an Emergency Worker   (Act 2018) 00873',
          'Date created': '7 Dec 2021',
        },
        {
          Name: 'Pre Cons.pdfPNC previous convictions',
          Type: 'Pre Cons',
          Event: 'Not attached to an event',
          'Date created': '17 Nov 2021',
        },
        {
          Name: 'cps.pdfCrown Prosecution Service case packSENSITIVE',
          Type: 'SA2020 Suspended Sentence Order',
          Event: 'PreviousCommon assault and battery - 10501',
          'Date created': '16 Oct 2021',
        },
      ])
  })
})
