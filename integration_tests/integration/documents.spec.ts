import Page from '../pages/page'
import DocumentsPage from '../pages/documents'
import outOfAreasBannerBlurb from '../constants'
// eslint-disable-next-line import/named
import { sortDataAndAssertSortExpectations } from './helper/sort-helper'

context('Documents', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetUnallocatedCase')
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
    cy.contains(outOfAreasBannerBlurb).should('not.exist')
  })

  it('Out of area transfer banner is visible on page and continue button is disabled when case is out of area transfer case', () => {
    cy.task('stubGetUnallocatedCaseWhereIsOutOfAreaTransfer')
    cy.reload()
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.documentsHeading().should('contain', 'Documents')
    documentsPage.outOfAreaBanner().should('contain', outOfAreasBannerBlurb)
    documentsPage.button().should('contain', 'Continue')
    documentsPage.button().should('be.disabled')
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

  it('Continue button enabled and visible on page', () => {
    const documentsPage = Page.verifyOnPage(DocumentsPage)
    documentsPage.button().should('contain', 'Continue')
    documentsPage.button().should('not.be.disabled')
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
    const sortExpectations = [
      {
        columnHeaderName: 'Name',
        orderedData: [
          // todo: someone could look into this? Problem outlined....
          // this column does not specify a "data-sort-value" attribute in "documents.njk" and so it just sorts the html value in the table's column cell
          // as a result, the sort basically does not work
          // I assume this was intentional for some reason??
          // for example, a fix could be to pass "document.fileName" as the "data-sort-value" attribute but perhaps this data field is unreliable and do not want to mess with production code and cause problems
        ],
      },
      {
        columnHeaderName: 'Type',
        orderedData: [
          'Planned Office Visit (NS)',
          'Planned Office Visit (NS)',
          'Pre Cons',
          'Pre-Sentence Report - Fast',
          'SA2020 Suspended Sentence Order',
        ],
      },
      {
        columnHeaderName: 'Event',
        orderedData: ['Current', 'Not attached to an event', 'Previous', 'Previous', 'Previous'],
      },
      {
        columnHeaderName: 'Date created',
        orderedData: ['', '', '16 Oct 2021', '7 Nov 2021', '7 Dec 2021'],
      },
    ]
    sortDataAndAssertSortExpectations(1, sortExpectations, false)
  })

  it('persists sort order when refreshing the page', () => {
    cy.get('table').within(() => cy.contains('button', 'Name').click())

    cy.get('table').within(() => cy.contains('button', 'Name').should('have.attr', { 'aria-sort': 'ascending' }))

    cy.reload()

    cy.get('table').within(() => cy.contains('button', 'Name').should('have.attr', { 'aria-sort': 'ascending' }))
  })
})
