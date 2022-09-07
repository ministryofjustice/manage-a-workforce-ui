import Page from '../pages/page'
import RiskPage from '../pages/risk'
import SummaryPage from '../pages/summary'
import ProbationRecordPage from '../pages/probationRecord'

context('Risk', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
  })

  it('Caption text visible on page', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Risk header visible on page', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.riskHeading().should('contain', 'Risk')
  })

  it('Allocate button visible on page', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.button().should('contain', 'Allocate')
  })

  it('Active registrations visible on page', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage
      .activeRegistrationsTable()
      .getTable()
      .should('deep.equal', [
        {
          Type: 'Suicide/self-harm',
          Registered: '13 Dec 2020',
          'Next review': '13 Jun 2022',
          Notes: 'Previous suicide /self-harm attempt. Needs further investigating.',
        },
        {
          Type: 'Child concerns',
          Registered: '13 Dec 2020',
          'Next review': '13 Mar 2022',
          Notes: 'Awaiting outcome of social services enquiry.',
        },
        {
          Type: 'Medium RoSH',
          Registered: '9 Nov 2021',
          'Next review': '9 May 2022',
          Notes: '-',
        },
      ])
  })

  it('Inactive registrations visible on page', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage
      .inactiveRegistrationsTable()
      .getTable()
      .should('deep.equal', [
        {
          Type: 'Domestic abuse perpetrator',
          Registered: '14 Jun 2012',
          'End date': '26 Nov 2019',
          Notes: '-',
        },
        {
          Type: 'Mental health issues',
          Registered: '13 Dec 2017',
          'End date': '13 Jun 2019',
          Notes: '-',
        },
      ])
  })

  it('Display text when no registrations on the page', () => {
    cy.task('stubGetRiskNoRegistrations')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.bodyText().contains('There are no active registrations.')
    riskPage.bodyText().contains('There are no inactive registrations.')
    riskPage.activeRegistrationsTable().should('not.exist')
    riskPage.inactiveRegistrationsTable().should('not.exist')
  })

  it('Displays Assessments when returned', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.roshWidget().trimTextContent().should('equal', 'High RoSH Risk of serious harmLast updated: 2 Feb 2022')
    riskPage
      .rsrWidget()
      .trimTextContent()
      .should('equal', 'Medium RSR 3.8% Risk of serious recidivismLast updated: 12 Feb 2019')
    riskPage
      .ogrsWidget()
      .trimTextContent()
      .should('equal', 'High OGRS 85% Offender group reconviction scaleLast updated: 17 Nov 2018')
  })

  it('Displays score unavailable when no assessments returned', () => {
    cy.task('stubGetRiskNoRegistrations')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.roshWidget().trimTextContent().should('equal', 'RoSH Risk of serious harmScore unavailable')
    riskPage.rsrWidget().trimTextContent().should('equal', 'RSR Risk of serious recidivismScore unavailable')
    riskPage.ogrsWidget().trimTextContent().should('equal', 'OGRS Offender group reconviction scaleScore unavailable')
  })

  it('Instructions text should save and display on summary page', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.instructionsTextArea().should('exist')
    riskPage.instructionsTextArea().type('Test')
    cy.task('stubGetUnallocatedCase')
    cy.visit('/J678910/convictions/123456789/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.instructionsTextArea().should('have.value', 'Test')
  })

  it('Instructions text should save and display on probation record page', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.instructionsTextArea().should('exist')
    riskPage.instructionsTextArea().type(' - this is a test')
    cy.task('stubGetProbationRecord')
    cy.visit('/J678910/convictions/123456789/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.instructionsTextArea().should('have.value', 'Test - this is a test')
  })
})
