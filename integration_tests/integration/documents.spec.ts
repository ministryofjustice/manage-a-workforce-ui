import Page from '../pages/page'
import DocumentsPage from '../pages/documents'

context('Documents', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.task('stubGetDocuments')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/documents')
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
        {
          Name: 'OfficeVisitDocument.DOCContact',
          Type: 'Planned Office Visit (NS)',
          Event: 'PreviousCommon assault and battery - 10501',
          'Date created': '',
        },
        {
          Name: 'documentWithoutId.pdfContact',
          Type: 'Planned Office Visit (NS)',
          Event: 'PreviousCommon assault and battery - 10501',
          'Date created': '',
        },
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
          Name: 'OfficeVisitDocument.DOCContact',
          Type: 'Planned Office Visit (NS)',
          Event: 'PreviousCommon assault and battery - 10501',
          'Date created': '',
        },
        {
          Name: 'documentWithoutId.pdfContact',
          Type: 'Planned Office Visit (NS)',
          Event: 'PreviousCommon assault and battery - 10501',
          'Date created': '',
        },
      ])
  })

  it('Shows message and table header if no data returned', () => {
    cy.task('stubGetDocumentsEmpty')
    cy.reload()
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    cy.get('table').should('exist')
    documentsPage.noDocumentsBody().should('exist')
    documentsPage.noDocumentsBody().should('contain.text', 'There are no documents to display.')
  })

  it('Download document links exist', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.downloadDocumentLink('J678910', 'efb7a4e8-3f4a-449c-bf6f-b1fc8def3410', 'cps.pdf').should('exist')
    documentsPage.downloadDocumentLink('J678910', '6c50048a-c647-4598-8fae-0b84c69ef31a', 'doc.pdf').should('exist')
    documentsPage
      .downloadDocumentLink('J678910', '626aa1d1-71c6-4b76-92a1-bf2f9250c143', 'Pre Cons.pdf')
      .should('exist')
    documentsPage
      .downloadDocumentLink('J678910', 'd3cb4b29-e2ce-4a9a-af3c-bc89d5e56f6c', 'OfficeVisitDocument.DOC')
      .should('exist')
  })

  it('Download document link does not exist for document without id', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.downloadDocumentLink('J678910', '', 'documentWithoutId.pdf').should('not.exist')
  })

  it('should show which column the table is currently sorted by', () => {
    const headings = ['Name', 'Type', 'Event', 'Date&nbsp;created']
    headings.forEach(heading => {
      it(`should set headings correctly when sorting by ${heading}`, () => {
        cy.get('table').within(() => cy.contains('button', heading).click())

        // check the clicked heading is sorted and all others are not
        cy.get('thead')
          .find('th')
          .each($el => {
            const sort = $el.text() === heading ? 'ascending' : 'none'
            cy.wrap($el).should('have.attr', { 'aria-sort': sort })
          })

        // clicking again sorts in the other direction
        cy.get('table').within(() => cy.contains('button', heading).click())

        cy.get('table').within(() => cy.contains('button', heading).should('have.attr', { 'aria-sort': 'descending' }))
      })
    })
  })

  it('persists sort order when refreshing the page', () => {
    cy.get('table').within(() => cy.contains('button', 'Name').click())

    cy.get('table').within(() => cy.contains('button', 'Name').should('have.attr', { 'aria-sort': 'ascending' }))

    cy.reload()

    cy.get('table').within(() => cy.contains('button', 'Name').should('have.attr', { 'aria-sort': 'ascending' }))
  })
})
