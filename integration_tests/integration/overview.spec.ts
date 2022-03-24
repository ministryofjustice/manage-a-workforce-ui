import Page from '../pages/page'
import OverviewPage from '../pages/overview'

context('Overview', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Officer details visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.captionText().should('contain', 'Wrexham - Team 1')
    overviewPage.secondaryText().should('contain', 'PO')
  })

  it('Breadcrumbs are visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case view')
      .and('contain', 'Allocate to probation practitioner')
  })

  it('Heading is visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.heading().should('contain', 'Current workload')
  })

  it('Sub nav visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.subNav().should('contain', 'Overview').and('contain', 'Active cases (22)')
  })

  it('Summary text is visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.summaryText().should('contain', 'View as points')
  })

  it('Points information visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    cy.get('.govuk-details .govuk-summary-list').getSummaryList().should('deep.equal', {
      'Points available': '1265',
      'Points used': '1580',
      'Points remaining': '-315',
    })
  })

  it('Under capacity card visible on page', () => {
    cy.task('stubGetOverviewUnderCapacity')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.cardHeading().should('contain', '98%')
    overviewPage.underCapacityCard().should('exist')
  })

  it('Over capacity card visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.cardHeading().should('contain', '126%')
    overviewPage.overCapacityCard().should('exist')
  })

  it('Last updated visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.lastUpdated().should('contain', 'Last updated: 3 Nov 2013 at 9:00am')
  })

  it('Total cases card visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.cardHeading().should('contain', '22')
    overviewPage.totalCases().should('contain', 'total cases')
    overviewPage
      .totalCasesLink()
      .should('have.attr', 'href')
      .and('include', '/J678910/convictions/123456789/allocate/OM2/active-cases')
  })

  it('Section break visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.sectionBreak().should('exist')
  })

  it('Availability header visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.heading().should('contain', 'Availability')
  })

  it('Availability summary list visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    cy.get('.availability').getSummaryList().should('deep.equal', {
      'Weekly hours': '22.5',
      Reductions: '10 hours until 3 Nov 2022',
      'Last case allocated': '',
    })
  })

  it('Case mix header is visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
    overviewPage.mediumHeading().should('contain', 'Case mix by tier')
  })

  it('Tier table is visible on page', () => {
    cy.task('stubGetOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/officer-view')
    const overviewPage = Page.verifyOnPage(OverviewPage)
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
})
