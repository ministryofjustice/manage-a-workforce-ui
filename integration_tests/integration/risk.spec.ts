import Page from '../pages/page'
import RiskPage from '../pages/risk'
import outOfAreasBannerBlurb from '../constants'

context('Risk', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
  })

  it('Caption text visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.task('stubGetRisk')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Risk header visible on page and out of area transfer banner is not visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.task('stubGetRisk')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.riskHeading().should('contain', 'Risk')
    cy.contains(outOfAreasBannerBlurb).should('not.exist')
  })

  it('Out of area transfer banner is visible on page and continue button is disabled when case is out of area transfer case', () => {
    cy.task('stubGetUnallocatedCaseWhereIsOutOfAreaTransfer')
    cy.task('stubGetRisk')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.riskHeading().should('contain', 'Risk')
    riskPage.outOfAreaBanner().should('contain', outOfAreasBannerBlurb)
    riskPage.button().should('contain', 'Continue')
    riskPage.button().should('have.attr', 'disabled')
  })

  it('Sub nav visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.task('stubGetRisk')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage
      .subNav()
      .should('contain', 'Summary')
      .and('contain', 'Probation record')
      .and('contain', 'Risk')
      .and('contain', 'Documents')
  })

  it('Risk tab is highlighted', () => {
    cy.task('stubGetUnallocatedCase')
    cy.task('stubGetRisk')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.highlightedTab().should('contain.text', 'Risk')
  })

  it('Continue button enabled and visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.task('stubGetRisk')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.button().should('contain', 'Continue')
    riskPage.button().should('not.have.class', 'govuk-button--disabled')
  })

  it('Active registrations visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.task('stubGetRisk')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage
      .activeRegistrationsTable()
      .getTable()
      .should('deep.equal', [
        {
          Flag: 'RoSH',
          Type: 'Suicide/self-harm',
          Registered: '13 December 2020',
          Notes: 'Previous suicide /self-harm attempt. Needs further investigating.',
        },
        {
          Flag: 'Alerts',
          Type: 'Child concerns',
          Registered: '13 December 2020',
          Notes: 'Awaiting outcome of social services enquiry.',
        },
        {
          Flag: 'Safeguarding',
          Type: 'Medium RoSH',
          Registered: '9 November 2021',
          Notes: '-',
        },
      ])
  })

  it('Inactive registrations visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.task('stubGetRisk')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage
      .inactiveRegistrationsTable()
      .getTable()
      .should('deep.equal', [
        {
          Flag: 'Information',
          Type: 'Domestic abuse perpetrator',
          Registered: '14 June 2012',
          'End date': '26 November 2019',
          Notes: '-',
        },
        {
          Flag: 'Public protection',
          Type: 'Mental health issues',
          Registered: '13 December 2017',
          'End date': '13 June 2019',
          Notes: '-',
        },
      ])
  })

  it('Display text when no registrations on the page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.task('stubGetRiskNoRegistrations')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.bodyText().contains('There are no active registrations.')
    riskPage.bodyText().contains('There are no inactive registrations.')
    riskPage.activeRegistrationsTable().should('not.exist')
    riskPage.inactiveRegistrationsTable().should('not.exist')
  })

  it('Displays Assessments when returned', () => {
    cy.task('stubGetUnallocatedCase')
    cy.task('stubGetRisk')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
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

  it('Displays Not Found Assessment', () => {
    cy.task('stubGetUnallocatedCase')
    cy.task('stubGetNotFoundRisk')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.roshWidget().should('have.class', 'rosh-widget--none')

    riskPage
      .roshWidget()
      .trimTextContent()
      .should(
        'equal',
        "Unknown RoSH Risk of serious harmA RoSH summary has not been completed for this individual. Check OASys for this person's current assessment status."
      )
    riskPage
      .rsrWidget()
      .trimTextContent()
      .should(
        'equal',
        "No RSR Risk of serious recidivismAn RSR summary has not been completed for this individual. Check OASys for this person's current assessment status."
      )
    riskPage
      .ogrsWidget()
      .trimTextContent()
      .should(
        'equal',
        "No OGRS Offender group reconviction scaleAn OGRS summary has not been completed for this individual. Check NDelius for this person's current assessment status."
      )
  })

  it('Displays Unavailable Assessment', () => {
    cy.task('stubGetUnallocatedCase')
    cy.task('stubGetUnavailableRisk')
    cy.visit('/pdu/PDU1/J678910/convictions/1/risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.roshWidget().should('have.class', 'rosh-widget--unavailable')
    riskPage
      .roshWidget()
      .trimTextContent()
      .should(
        'equal',
        'Unknown RoSH Risk of serious harmSomething went wrong. We are unable to show RoSH at this time. Try again later.'
      )
    riskPage.rsrWidget().should('have.class', 'rosh-widget--unavailable')
    riskPage
      .rsrWidget()
      .trimTextContent()
      .should(
        'equal',
        'Unknown RSR Risk of serious recidivismSomething went wrong. We are unable to show RSR at this time. Try again later.'
      )
  })
})
