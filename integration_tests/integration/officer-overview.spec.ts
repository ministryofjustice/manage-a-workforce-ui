import Page from '../pages/page'
import OverviewPage from '../pages/overview'

context('Overview', () => {
  let overviewPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM2/officer-view')
    overviewPage = Page.verifyOnPage(OverviewPage)
  })

  it('Officer details visible on page', () => {
    overviewPage.captionText().should('contain', 'Wrexham - Team 1')
    overviewPage.secondaryText().should('contain', 'PO')
  })

  it('Back link is visible on page', () => {
    overviewPage.backLink().should('contain', 'Back')
  })

  it('notification banner is not visible when officer has an email', () => {
    overviewPage.notificationBanner().should('not.exist')
  })

  it('notification banner is visible when officer has no email', () => {
    cy.task('stubGetOverviewWithLastAllocatedEvent')
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM6/officer-view')
    overviewPage
      .notificationBanner()
      .should(
        'contain',
        'You cannot allocate cases to John Doe through the Allocations tool because they do not have an email address associated with their NDelius account.'
      )
  })

  it('Heading is visible on page', () => {
    overviewPage.heading().should('contain', 'Workload')
  })

  it('Sub nav visible on page', () => {
    overviewPage.subNav().should('contain', 'Overview').and('contain', 'Active cases (22)')
  })

  it('Overview tab is highlighted', () => {
    overviewPage.highlightedTab().should('contain.text', 'Overview').and('not.contain.text', 'Active cases')
  })

  it('Summary text is visible on page', () => {
    overviewPage.summaryText().should('contain', 'View as points')
  })

  it('Points information visible on page', () => {
    cy.get('.govuk-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      'Points available': '1265',
      'Points used': '1580',
      'Points remaining': '-315',
    })
  })

  it('Under capacity card visible on page', () => {
    cy.task('stubGetOverviewUnderCapacity')
    cy.reload()
    overviewPage.cardHeading().should('contain', '98%')
    overviewPage.underCapacityCard().should('exist')
  })

  it('Over capacity card visible on page', () => {
    overviewPage.cardHeading().should('contain', '126%')
    overviewPage.overCapacityCard().should('exist')
  })

  it('Last updated visible on page', () => {
    overviewPage.lastUpdated().should('contain', 'Last updated: 3 November 2013 at 9:00am')
  })

  it('Total cases card visible on page', () => {
    overviewPage.cardHeading().should('contain', '22')
    overviewPage.totalCases().should('contain', 'cases')
    overviewPage
      .totalCasesLink()
      .should('have.attr', 'href')
      .and('include', '/team/TM1/J678910/convictions/123456789/allocate/OM2/active-cases')
  })

  it('Section break visible on page', () => {
    overviewPage.sectionBreak().should('exist')
  })

  it('Availability header visible on page', () => {
    overviewPage.heading().should('contain', 'Availability')
  })

  it('Availability summary list visible on page', () => {
    cy.get('.availability').getSummaryList().should('deep.equal', {
      'Weekly hours': '22.5',
      Reductions: '10 hours until 3 November 2022',
      'Last case allocated': '',
      'Cases due to end within next 4 weeks': '3',
      'Releases within next 4 weeks': '6',
      'Parole reports to complete within next 4 weeks': '5',
    })
  })

  it('Case mix header is visible on page', () => {
    overviewPage.mediumHeading().should('contain', 'Case mix by tier')
  })

  it('Tier table is visible on page', () => {
    overviewPage
      .tierTable()
      .getTable()
      .should('deep.equal', [
        {
          Tier: 'A',
          'Number of cases': '6',
        },
        {
          Tier: 'B',
          'Number of cases': '10',
        },
        {
          Tier: 'C',
          'Number of cases': '12',
        },
        {
          Tier: 'D',
          'Number of cases': '14',
        },
        {
          Tier: 'Untiered',
          'Number of cases': '2',
        },
      ])
  })

  it('must show last allocated event information in Last Case Allocated', () => {
    cy.task('stubGetOverviewWithLastAllocatedEvent')
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM6/officer-view')
    cy.get('.availability').getSummaryList().should('deep.equal', {
      'Weekly hours': '22.5',
      Reductions: '10 hours until 3 November 2022',
      'Last case allocated': '19 August 2022 (Tier A3, in community)',
      'Cases due to end within next 4 weeks': '3',
      'Releases within next 4 weeks': '6',
      'Parole reports to complete within next 4 weeks': '5',
    })
  })
})
