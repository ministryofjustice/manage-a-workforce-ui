import Page from '../pages/page'
import SummaryPage from '../pages/summary'
import ProbationRecordPage from '../pages/probationRecord'
import RiskPage from '../pages/risk'

context('Summary', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
  })

  it('Caption text visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/team/N03F01/J678910/convictions/123456789/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Summary header visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/team/N03F01/J678910/convictions/123456789/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.summaryHeading().should('contain', 'Summary')
  })

  it('Sub nav visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.get('a[href*="team/N03F01/J678910/convictions/123456789/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.subNav().should('contain', 'Summary').and('contain', 'Probation record').and('contain', 'Risk')
  })

  it('Continue button visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/team/N03F01/J678910/convictions/123456789/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.button().should('contain', 'Continue')
  })

  it('Personal details visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.get('a[href*="team/N03F01/J678910/convictions/123456789/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.personalDetailsTitle().should('have.text', 'Personal details')
    cy.get('#personal-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      Name: 'Dylan Adam Armstrong',
      Gender: 'Male',
      'Date of birth': '27 Sep 1984 (37 years old)',
      PNC: 'D/9874483AB',
      'Main address': '5A The Building The StreetReadingBerkshireRG22 3EF',
    })
  })

  it('Personal details no address visible on page', () => {
    cy.task('stubGetUnallocatedCaseMultiOffences')
    cy.signIn()
    cy.get('a[href*="L786545/convictions/56789/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.personalDetailsTitle().should('have.text', 'Personal details')
    cy.get('#personal-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      Name: 'Dylan Adam Armstrong',
      Gender: 'Female',
      'Date of birth': '17 Nov 1994 (27 years old)',
      PNC: 'A/8404713BA',
      'Main address': 'No address found',
    })
  })

  it('Sentence visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.get('a[href*="team/N03F01/J678910/convictions/123456789/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.sentenceTitle().should('have.text', 'Sentence')
    cy.get('#sentence .govuk-summary-list').getSummaryList().should('deep.equal', {
      Offence: 'Common assault and battery Contrary to section 39 of the Criminal Justice Act 1988.',
      Order: 'SA2020 Suspended Sentence Order (28 days) Start date: 1 Sep 2021 End date: 28 Sep 2021',
      Requirements: 'Unpaid Work: Regular 100 Hours',
    })
  })

  it('Sentence visible on page when invalid end date', () => {
    cy.task('stubGetUnallocatedCaseInvalidEndDate')
    cy.signIn()
    cy.get('a[href*="J678910/convictions/123456789/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.sentenceTitle().should('have.text', 'Sentence')
    cy.get('#sentence .govuk-summary-list').getSummaryList().should('deep.equal', {
      Offence: 'Common assault and battery Contrary to section 39 of the Criminal Justice Act 1988.',
      Order: 'SA2020 Suspended Sentence Order Start date: 1 Sep 2021 End date: Invalid Date',
      Requirements: 'Unpaid Work: Regular 100 Hours',
    })
  })

  it('Sentence visible on page with multiple offences and requirements', () => {
    cy.task('stubGetUnallocatedCaseMultiOffences')
    cy.signIn()
    cy.get('a[href*="team/N03F01/L786545/convictions/56789/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.sentenceTitle().should('have.text', 'Sentence')
    cy.get('#sentence .govuk-summary-list').getSummaryList().should('deep.equal', {
      Offence:
        'Common assault and battery Contrary to section 39 of the Criminal Justice Act 1988. Attempt theft from the person of another Contrary to section 1(1) of the Criminal Attempts Act 1981. Assault by beating Contrary to section 39 of the Criminal Justice Act 1988.',
      Order: 'SA2020 Suspended Sentence Order (3 months) Start date: 2 Sep 2021 End date: 1 Dec 2021',
      Requirements:
        'Unpaid Work: Regular 100 Hours Rehabilitation Activity Requirement (RAR): Regular 20 Days Court - Accredited Programme - Building Better Relationships: Regular 20 Days',
    })
  })

  it('Case details visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.get('a[href*="team/N03F01/J678910/convictions/123456789/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.caseDetailsTitle().should('have.text', 'Case information')
    summaryPage.downloadLink('J678910', '123456789', '00000000-0000-0000-0000-000000000000').should('exist')
    summaryPage.downloadLink('J678910', '123456789', '11111111-1111-1111-1111-111111111111').should('exist')
    summaryPage.downloadLink('J678910', '123456789', '22222222-2222-2222-2222-222222222222').should('exist')
    cy.get('#case-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      'CPS pack': '27 Feb 2022Download pack',
      'Pre-convictions': '27 Mar 2022Download document',
      'Pre-sentence reportFast': '27 Jan 2022Download report',
      'Last OASys assessmentOASys Assessment Layer 3': '27 Jan 2022',
    })
  })

  it('Case details visible on page with no reports or assessments', () => {
    cy.task('stubGetUnallocatedCaseMultiOffences')
    cy.signIn()
    cy.get('a[href*="L786545/convictions/56789/case-view"]').click()
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.caseDetailsTitle().should('have.text', 'Case information')
    cy.get('#case-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      'CPS pack': 'No pack created',
      'Pre-convictions': 'No document created',
      'Pre-sentence report': 'No report created',
      'Last OASys assessment': 'No assessment created',
    })
  })

  it('Breadcrumbs visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/team/N03F01/J678910/convictions/123456789/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.breadCrumbs().should('contain', 'Home').and('contain', 'Unallocated cases')
  })

  it('Instructions textArea should be visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/team/N03F01/J678910/convictions/123456789/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('exist')
  })

  it('Instructions text should save and display on probation record page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/team/N03F01/J678910/convictions/123456789/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('exist')
    summaryPage.instructionsTextArea().type('Test')
    cy.task('stubGetProbationRecord')
    cy.visit('/team/N03F01/J678910/convictions/123456789/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.instructionsTextArea().should('have.value', 'Test')
  })

  it('Instructions text should save and display on risk page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/team/N03F01/J678910/convictions/123456789/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('exist')
    summaryPage.instructionsTextArea().type(' - this is a test')
    cy.task('stubGetRisk')
    cy.visit('/team/N03F01/J678910/convictions/123456789/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.instructionsTextArea().should('have.value', 'Test - this is a test')
  })
})
