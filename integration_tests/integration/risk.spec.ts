import Page from '../pages/page'
import RiskPage from '../pages/risk'

context('Risk', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
  })

  it('Caption text visible on page', () => {
    cy.task('stubGetRisk')
    cy.visit('/team/TM1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Risk header visible on page', () => {
    cy.task('stubGetRisk')
    cy.visit('/team/TM1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.riskHeading().should('contain', 'Risk')
  })

  it('Sub nav visible on page', () => {
    cy.task('stubGetRisk')
    cy.visit('/team/TM1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage
      .subNav()
      .should('contain', 'Summary')
      .and('contain', 'Probation record')
      .and('contain', 'Risk')
      .and('contain', 'Documents')
  })

  it('Risk tab is highlighted', () => {
    cy.task('stubGetRisk')
    cy.visit('/team/TM1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.highlightedTab().should('contain.text', 'Risk')
  })

  it('Continue button visible on page', () => {
    cy.task('stubGetRisk')
    cy.visit('/team/TM1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.button().should('contain', 'Continue')
  })

  it('Active registrations visible on page', () => {
    cy.task('stubGetRisk')
    cy.visit('/team/TM1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage
      .activeRegistrationsTable()
      .getTable()
      .should('deep.equal', [
        {
          Type: 'Suicide/self-harm',
          Registered: '13 December 2020',
          Notes: 'Previous suicide /self-harm attempt. Needs further investigating.',
        },
        {
          Type: 'Child concerns',
          Registered: '13 December 2020',
          Notes: 'Awaiting outcome of social services enquiry.',
        },
        {
          Type: 'Medium RoSH',
          Registered: '9 November 2021',
          Notes: '-',
        },
      ])
  })

  it('Inactive registrations visible on page', () => {
    cy.task('stubGetRisk')
    cy.visit('/team/TM1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage
      .inactiveRegistrationsTable()
      .getTable()
      .should('deep.equal', [
        {
          Type: 'Domestic abuse perpetrator',
          Registered: '14 June 2012',
          'End date': '26 November 2019',
          Notes: '-',
        },
        {
          Type: 'Mental health issues',
          Registered: '13 December 2017',
          'End date': '13 June 2019',
          Notes: '-',
        },
      ])
  })

  it('Display text when no registrations on the page', () => {
    cy.task('stubGetRiskNoRegistrations')
    cy.visit('/team/TM1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.bodyText().contains('There are no active registrations.')
    riskPage.bodyText().contains('There are no inactive registrations.')
    riskPage.activeRegistrationsTable().should('not.exist')
    riskPage.inactiveRegistrationsTable().should('not.exist')
  })

  it('Displays Assessments when returned', () => {
    cy.task('stubGetRisk')
    cy.visit('/team/TM1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage
      .roshWidget()
      .trimTextContent()
      .should(
        'equal',
        'Very high RoSH Risk of serious harmLast updated: 7 October 2022 Risk of serious harm in Community Risk to Community Children Low Known adult Medium Public High Staff Very high'
      )
    riskPage
      .roshDetail()
      .find('td')
      .then($data => {
        expect($data.get(0).className).not.to.contain('rosh--low')
        expect($data.get(1).className).not.to.contain('rosh--medium')
        expect($data.get(2).className).not.to.contain('rosh--high')
        expect($data.get(3).className).to.contain('rosh--very-high')
      })
    riskPage
      .rsrWidget()
      .trimTextContent()
      .should('equal', 'Medium RSR 3.8% Risk of serious recidivismLast updated: 12 February 2019')
    riskPage
      .ogrsWidget()
      .trimTextContent()
      .should('equal', 'High OGRS 85% Offender group reconviction scaleLast updated: 17 November 2018')
  })

  it('Displays score unavailable when no assessments returned', () => {
    cy.task('stubGetRiskNoRegistrations')
    cy.visit('/team/TM1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage
      .roshWidget()
      .trimTextContent()
      .should(
        'equal',
        'UNKNOWN LEVEL RoSH Risk of serious harmA RoSH summary has not been completed for this person. Check OASys for their current assessment status.'
      )
    riskPage.rsrWidget().trimTextContent().should('equal', 'RSR Risk of serious recidivismScore unavailable')
    riskPage.ogrsWidget().trimTextContent().should('equal', 'OGRS Offender group reconviction scaleScore unavailable')
  })
})
