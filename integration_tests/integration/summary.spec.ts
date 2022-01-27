import Page from '../pages/page'
import SummaryPage from '../pages/summary'

context('Summary', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Caption text visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Summary header visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.summaryHeading().should('contain', 'Summary')
  })

  it('Sub nav visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.get('a[href*="J678910/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.subNav().should('contain', 'Summary').and('contain', 'Probation record').and('contain', 'Risk')
  })

  it('Allocate button visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.button().should('contain', 'Allocate')
  })

  it('Personal details visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.get('a[href*="J678910/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.personalDetailsTitle().should('have.text', 'Personal details')
    cy.get('#personal-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      Name: 'Dylan Adam Armstrong',
      Gender: 'Male',
      'Date of birth': '27 Sep 1984 (37 years old)',
    })
  })

  it('Sentence visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.get('a[href*="J678910/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.sentenceTitle().should('have.text', 'Sentence')
    cy.get('#sentence .govuk-summary-list').getSummaryList().should('deep.equal', {
      Offence: 'Common assault and battery Contrary to section 39 of the Criminal Justice Act 1988.',
      Order: 'Community order (28 days) Start date: 1 Sep 2021 End date: 28 Sep 2021',
      Requirements: 'Unpaid Work: Regular 100 Hours',
    })
  })

  it('Sentence visible on page with multiple offences and requirements', () => {
    cy.task('stubGetUnallocatedCaseMultiOffences')
    cy.signIn()
    cy.get('a[href*="L786545/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.sentenceTitle().should('have.text', 'Sentence')
    cy.get('#sentence .govuk-summary-list').getSummaryList().should('deep.equal', {
      Offence:
        'Common assault and battery Contrary to section 39 of the Criminal Justice Act 1988. Attempt theft from the person of another Contrary to section 1(1) of the Criminal Attempts Act 1981. Assault by beating Contrary to section 39 of the Criminal Justice Act 1988.',
      Order: 'Community order (3 months) Start date: 2 Sep 2021 End date: 1 Dec 2021',
      Requirements:
        'Unpaid Work: Regular 100 Hours Rehabilitation Activity Requirement (RAR): Regular 20 Days Court - Accredited Programme - Building Better Relationships: Regular 20 Days',
    })
  })

  it('Case details visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.get('a[href*="J678910/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.caseDetailsTitle().should('have.text', 'Case details')
    cy.get('#case-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      PNC: 'D/9874483AB',
      'CPS pack': 'Missing',
      'Pre-convictions': 'Missing',
      'Pre-sentence reportFast': '27 Jan 2022',
      'Last OASys assessment': '27 Jan 2022',
    })
  })

  it('Back button displayed if coming from previous page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.get('a[href*="J678910/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.backLink().should('have.text', 'Back to unallocated cases')
  })

  it('Back button is not displayed if going directly onto page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.backLink().should('not.exist')
  })
})
