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
    cy.get('.govuk-summary-list').getSummaryList().should('deep.equal', {
      'Points available': '1265',
      'Points used': '1580',
      'Points remaining': '-315',
    })
  })
})
