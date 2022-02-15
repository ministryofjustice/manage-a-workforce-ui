import Page from '../pages/page'
import RiskPage from '../pages/risk'

context('Risk', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Caption text visible on page', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Risk header visible on page', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.riskHeading().should('contain', 'Risk')
  })

  it('Allocate button visible on page', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.button().should('contain', 'Allocate')
  })

  it('Active registrations visible on page', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/risk')
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
    cy.visit('/J678910/risk')
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
    cy.visit('/J678910/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.bodyText().contains('There are no active registrations.')
    riskPage.bodyText().contains('There are no inactive registrations.')
    riskPage.activeRegistrationsTable().should('not.exist')
    riskPage.inactiveRegistrationsTable().should('not.exist')
  })

  it('Displays Assessments when returned', () => {
    cy.task('stubGetRisk')
    cy.signIn()
    cy.visit('/J678910/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.roshIndexCard().trimTextContent().should('equal', 'ROSHRisk of Serious Harm Last updated: 2 Feb 2022 HIGH')
    riskPage
      .rsrIndexCard()
      .trimTextContent()
      .should('equal', 'RSRRisk of Serious Recidivism 3.8% Last updated: 12 Feb 2019 MEDIUM')
    riskPage.ogrsIndexCard().trimTextContent().should('equal', 'OGRSOffender Group Reconviction Scale 85%')
  })

  it('Displays score unavailable when no assessments returned', () => {
    cy.task('stubGetRiskNoRegistrations')
    cy.signIn()
    cy.visit('/J678910/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.roshIndexCard().trimTextContent().should('equal', 'ROSHRisk of Serious Harm Score unavailable')
    riskPage.rsrIndexCard().trimTextContent().should('equal', 'RSRRisk of Serious Recidivism Score unavailable')
    riskPage
      .ogrsIndexCard()
      .trimTextContent()
      .should('equal', 'OGRSOffender Group Reconviction Scale Score unavailable')
  })
})
