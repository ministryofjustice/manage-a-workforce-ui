import Page from '../../pages/page'
import RiskPage from '../../pages/risk'
import outOfAreasBannerBlurb from '../../constants'

context('Risk', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
    cy.task('stubForFeatureflagEnabled')
    cy.task('stubGetCrnAccess')
    cy.signIn()
  })

  it('Caption text visible on page', () => {
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAllocatedRiskV1')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.visit('/pdu/PDU1/J678910/reallocation-risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Risk header visible on page and out of area transfer banner is not visible on page', () => {
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAllocatedRiskV1')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.visit('/pdu/PDU1/J678910/reallocation-risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.riskHeading().should('contain', 'Risk')
    cy.contains(outOfAreasBannerBlurb).should('not.exist')
  })

  it('Sub nav visible on page', () => {
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAllocatedRiskV1')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.visit('/pdu/PDU1/J678910/reallocation-risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage
      .subNav()
      .should('contain', 'Reallocation')
      .and('contain', 'Personal details')
      .and('contain', 'Probation record')
      .and('contain', 'Risk')
      .and('contain', 'Documents')
  })

  it('Risk tab is highlighted', () => {
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAllocatedRiskV1')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.visit('/pdu/PDU1/J678910/reallocation-risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.highlightedTab().should('contain.text', 'Risk')
  })

  it('Active registrations visible on page', () => {
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAllocatedRiskV1')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.visit('/pdu/PDU1/J678910/reallocation-risk')
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
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAllocatedRiskV1')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.visit('/pdu/PDU1/J678910/reallocation-risk')
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
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAllocatedRiskV1', {
      activeRegistrations: [],
      inactiveRegistrations: [],
      risk: {
        roshRisk: {
          overallRisk: 'NOT_FOUND',
          riskInCommunity: {},
        },
        riskOfSeriousRecidivismScore: {
          scoreLevel: 'NOT_FOUND',
          percentageScore: -2147483648,
        },
      },
    })
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.visit('/pdu/PDU1/J678910/reallocation-risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.bodyText().contains('There are no active registrations.')
    riskPage.bodyText().contains('There are no inactive registrations.')
    riskPage.activeRegistrationsTable().should('not.exist')
    riskPage.inactiveRegistrationsTable().should('not.exist')
  })

  it('Displays Assessments when returned', () => {
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAllocatedRiskV1')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.visit('/pdu/PDU1/J678910/reallocation-risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage
      .roshWidget()
      .trimTextContent()
      .should(
        'equal',
        'Very high RoSH Risk of serious harm Last updated: 1 December 2025 Risk of serious harm in Community Risk to Community Children Very high Known adult Very high Public Very high Staff Very high',
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
      .should('equal', 'High RSR 8.47% Risk of serious recidivism Last updated: 1 December 2025')
    riskPage
      .ogrsWidget()
      .trimTextContent()
      .should('equal', 'LOW OGRS 26% Offender group reconviction scale Last updated: 1 December 2025')
  })

  it('Displays Not Found Assessment', () => {
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAllocatedRiskV1', {
      activeRegistrations: [],
      inactiveRegistrations: [],
      risk: {
        roshRisk: {
          overallRisk: 'NOT_FOUND',
          riskInCommunity: {},
        },
        riskOfSeriousRecidivismScore: {
          scoreLevel: 'NOT_FOUND',
          percentageScore: -2147483648,
        },
      },
    })
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.visit('/pdu/PDU1/J678910/reallocation-risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.roshWidget().should('have.class', 'rosh-widget--none')

    riskPage
      .roshWidget()
      .trimTextContent()
      .should(
        'equal',
        "Unknown RoSH Risk of serious harm A RoSH summary has not been completed for this individual. Check OASys for this person's current assessment status.",
      )
    riskPage
      .rsrWidget()
      .trimTextContent()
      .should(
        'equal',
        "No RSR Risk of serious recidivism An RSR summary has not been completed for this individual. Check OASys for this person's current assessment status.",
      )
    riskPage
      .ogrsWidget()
      .trimTextContent()
      .should(
        'equal',
        "No OGRS Offender group reconviction scale An OGRS summary has not been completed for this individual. Check NDelius for this person's current assessment status.",
      )
  })

  it('Displays Unavailable Assessment', () => {
    cy.task('stubGetAllocatedCase')
    cy.task('stubGetAllocatedRiskV1', {
      risk: {
        roshRisk: {
          overallRisk: 'UNAVAILABLE',
          riskInCommunity: {},
        },
        riskOfSeriousRecidivismScore: {
          scoreLevel: 'UNAVAILABLE',
          percentageScore: -2147483648,
        },
      },
    })
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.visit('/pdu/PDU1/J678910/reallocation-risk')
    const riskPage = Page.verifyOnPage(RiskPage)
    riskPage.roshWidget().should('have.class', 'rosh-widget--unavailable')
    riskPage
      .roshWidget()
      .trimTextContent()
      .should(
        'equal',
        'Unknown RoSH Risk of serious harm Something went wrong. We are unable to show RoSH at this time. Try again later.',
      )
    riskPage.rsrWidget().should('have.class', 'rosh-widget--unavailable')
    riskPage
      .rsrWidget()
      .trimTextContent()
      .should(
        'equal',
        'Unknown RSR Risk of serious recidivism Something went wrong. We are unable to show RSR at this time. Try again later.',
      )
  })
})
