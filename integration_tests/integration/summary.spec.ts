import Page from '../pages/page'
import SummaryPage from '../pages/summary'

context('Summary', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
  })

  it('Caption text visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Summary header visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.summaryHeading().should('contain', 'Summary')
  })

  it('Sub nav visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage
      .subNav()
      .should('contain', 'Summary')
      .and('contain', 'Probation record')
      .and('contain', 'Risk')
      .and('contain', 'Documents')
  })

  it('Summary tab is highlighted', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.highlightedTab().should('contain.text', 'Summary')
  })

  it('Continue button visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.button().should('contain', 'Continue')
  })

  it('Personal details visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.personalDetailsTitle().should('have.text', 'Personal details')
    cy.get('#personal-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      Name: 'Dylan Adam Armstrong',
      Gender: 'Male',
      'Date of birth': '27 September 1984 (37 years old)',
      PNC: 'D/9874483AB',
      'Main address':
        '5A The Building The StreetReadingBerkshireRG22 3EFType of address: Rental accommodation (verified)Start date: 25 August 2022',
    })
  })

  it('Personal details no fixed abode address visible on page', () => {
    cy.task('stubGetUnallocatedCaseMultiOffences')
    cy.reload()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.personalDetailsTitle().should('have.text', 'Personal details')
    cy.get('#personal-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      Name: 'Dylan Adam Armstrong',
      Gender: 'Female',
      'Date of birth': '17 November 1994 (27 years old)',
      PNC: 'A/8404713BA',
      'Main address': 'No fixed abode: Homeless - rough sleepingStart date: 3 February 2022',
    })
  })

  it('Sentence visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.sentenceTitle().should('have.text', 'Sentence')
    cy.get('#sentence .govuk-summary-list').getSummaryList().should('deep.equal', {
      Offence: 'Common assault and battery Contrary to section 39 of the Criminal Justice Act 1988.',
      Order: 'SA2020 Suspended Sentence Order (6 Months) Start date: 1 September 2021 End date: 28 September 2021',
      Requirements: 'Unpaid Work: Regular 100 Hours',
    })
  })

  it('Sentence visible on page when invalid end date', () => {
    cy.task('stubGetUnallocatedCaseInvalidEndDate')
    cy.reload()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.sentenceTitle().should('have.text', 'Sentence')
    cy.get('#sentence .govuk-summary-list').getSummaryList().should('deep.equal', {
      Offence: 'Common assault and battery Contrary to section 39 of the Criminal Justice Act 1988.',
      Order: 'SA2020 Suspended Sentence Order Start date: 1 September 2021 End date: Invalid Date',
      Requirements: 'Unpaid Work: Regular 100 Hours',
    })
  })

  it('Sentence visible on page with multiple offences and requirements', () => {
    cy.task('stubGetUnallocatedCaseMultiOffences')
    cy.reload()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.sentenceTitle().should('have.text', 'Sentence')
    cy.get('#sentence .govuk-summary-list').getSummaryList().should('deep.equal', {
      Offence:
        'Common assault and battery Contrary to section 39 of the Criminal Justice Act 1988. Attempt theft from the person of another Contrary to section 1(1) of the Criminal Attempts Act 1981. Assault by beating Contrary to section 39 of the Criminal Justice Act 1988.',
      Order: 'SA2020 Suspended Sentence Order (8 Months) Start date: 2 September 2021 End date: 1 December 2021',
      Requirements:
        'Unpaid Work: Regular 100 Hours Rehabilitation Activity Requirement (RAR): Regular 20 Days Court - Accredited Programme - Building Better Relationships: Regular 20 Days',
    })
  })

  it('Associated Documents visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.associatedDocumentsTitle().should('have.text', 'Associated documents')
    summaryPage.downloadDocumentLink('J678910', '00000000-0000-0000-0000-000000000000', 'courtFile.pdf').should('exist')
    summaryPage
      .downloadDocumentLink('J678910', '11111111-1111-1111-1111-111111111111', 'cpsPackFile.pdf')
      .should('exist')
    summaryPage
      .downloadDocumentLink('J678910', '22222222-2222-2222-2222-222222222222', 'preConsFile.pdf')
      .should('exist')
    cy.get('#case-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      'CPS pack': 'Download CPS pack Uploaded 27 February 2022',
      'Pre-convictions': 'Download Pre-convictions document Uploaded 27 March 2022',
      'Pre-sentence report': 'Download Pre-Sentence Report - Fast Uploaded 27 January 2022',
      OASys: 'CHECK OASYSUploaded 27 January 2022',
    })
  })

  it('Associated Documents visible on page with no reports or assessments', () => {
    cy.task('stubGetUnallocatedCaseMultiOffences')
    cy.reload()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.associatedDocumentsTitle().should('have.text', 'Associated documents')
    cy.get('#case-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      'CPS pack': 'Check Documents screen',
      'Pre-convictions': 'Check Documents screen',
      'Pre-sentence report': 'Check Documents screen',
      OASys: 'CHECK OASYS',
    })
  })

  it('Breadcrumbs visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.breadCrumbs().should('contain', 'Home').and('contain', 'Unallocated cases')
  })

  it('Instructions textArea should be visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('exist')
  })

  it('Documents page link exists', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.associatedDocumentsLink().should('exist')
  })
})
