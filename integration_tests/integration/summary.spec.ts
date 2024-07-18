import Page from '../pages/page'
import SummaryPage from '../pages/summary'
import outOfAreasBannerBlurb from '../constants'

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

  it('Summary header visible on page and out of area transfer banner is not visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.summaryHeading().should('contain', 'Summary')
    cy.contains(outOfAreasBannerBlurb).should('not.exist')
  })

  it('Out of area transfer banner is visible on page and continue button is disabled when case is out of area transfer case', () => {
    cy.task('stubGetUnallocatedCaseWhereIsOutOfAreaTransfer')
    cy.reload()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.summaryHeading().should('contain', 'Summary')
    summaryPage.outOfAreaBanner().should('contain', outOfAreasBannerBlurb)
    summaryPage.button().should('contain', 'Continue')
    summaryPage.button().should('have.class', 'govuk-button--disabled')
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

  it('Continue button enabled and visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.button().should('contain', 'Continue')
    summaryPage.button().should('not.have.class', 'govuk-button--disabled')
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

  it('No requirements sentence visible on page', () => {
    cy.task('stubGetUnallocatedCaseNoRequirements')
    cy.reload()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.sentenceTitle().should('have.text', 'Sentence')
    cy.get('#sentence .govuk-summary-list').getSummaryList().should('deep.equal', {
      Offence: 'Common assault and battery Contrary to section 39 of the Criminal Justice Act 1988.',
      Order: 'SA2020 Suspended Sentence Order (6 Months) Start date: 1 September 2021 End date: 28 September 2021',
      Requirements: 'There are no requirements to display.',
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

  it('Risk visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.riskTitle().should('have.text', 'Risk')
    cy.get('#risk .govuk-summary-list').getSummaryList().should('deep.equal', {
      'Risk assessment': 'VERY HIGH RoSH MEDIUM RSR HIGH OGRS',
      'Active risk registrations': 'ALT Under MAPPA Arrangements, Suicide/self-harm',
      OASys: 'CHECK OASYSUploaded 27 January 2022',
    })
    summaryPage.riskSummaryBadge().then($data => {
      expect($data.get(0).className).to.contain('risk-badge--very-high')
      expect($data.get(1).className).to.contain('risk-badge--medium')
      expect($data.get(2).className).to.contain('risk-badge--high')
    })
  })

  it('Unavailable Risk visible on page', () => {
    cy.task('stubGetUnallocatedCaseUnavailableRisk')
    cy.reload()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.riskTitle().should('have.text', 'Risk')
    cy.get('#risk .govuk-summary-list').getSummaryList().should('deep.equal', {
      'Risk assessment': 'Unknown RoSH Unknown RSR No OGRS',
      'Active risk registrations': 'There are no active registrations.',
      OASys: 'CHECK OASYSUploaded 27 January 2022',
    })
    summaryPage.riskSummaryBadge().then($data => {
      expect($data.get(0).className).to.contain('risk-badge--unavailable')
      expect($data.get(1).className).to.contain('risk-badge--unavailable')
      expect($data.get(2).className).to.contain('risk-badge--none')
    })
  })

  it('Not Found Risk visible on page', () => {
    cy.task('stubGetUnallocatedCaseNotFoundRisk')
    cy.reload()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.riskTitle().should('have.text', 'Risk')
    cy.get('#risk .govuk-summary-list').getSummaryList().should('deep.equal', {
      'Risk assessment': 'Unknown RoSH No RSR No OGRS',
      OASys: 'CHECK OASYSUploaded 27 January 2022',
      'Active risk registrations': 'There are no active registrations.',
    })
    summaryPage.riskSummaryBadge().then($data => {
      expect($data.get(0).className).to.contain('risk-badge--none')
      expect($data.get(1).className).to.contain('risk-badge--none')
      expect($data.get(2).className).to.contain('risk-badge--none')
    })
  })

  it('Documents visible on page', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.associatedDocumentsTitle().should('have.text', 'Documents')
    cy.get('#case-details .govuk-body-m')
      .first()
      .should(
        'have.text',
        'All documents related to the current and previous events are listed on\n' +
          '                            the Documents screen.'
      )
    cy.get('#case-details .govuk-body-m')
      .last()
      .should('have.text', 'You can sort by date, event, document type, or name.')
  })

  it('Documents visible on page with no reports or assessments', () => {
    cy.task('stubGetUnallocatedCaseMultiOffences')
    cy.reload()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.associatedDocumentsTitle().should('have.text', 'Documents')
    cy.get('#case-details .govuk-body-m')
      .first()
      .should(
        'have.text',
        'All documents related to the current and previous events are listed on\n' +
          '                            the Documents screen.'
      )
    cy.get('#case-details .govuk-body-m')
      .last()
      .should('have.text', 'You can sort by date, event, document type, or name.')
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

  it('Risk page link exists', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.associatedRiskLink().should('exist')
  })

  it('entering link in allocation notes errors', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().type('https://bbc.co.uk/noway')
    cy.get(`#1`).click()
    summaryPage
      .errorMessage()
      .trimTextContent()
      .should('equal', 'Error: You cannot include links in the allocation notes')
  })

  it('entering link without scheme but with www in allocation notes errors', () => {
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().type('www.bbc.co.uk/noway')
    cy.get(`#1`).click()
    summaryPage
      .errorMessage()
      .trimTextContent()
      .should('equal', 'Error: You cannot include links in the allocation notes')
  })
})
