import BeforeYouStartPage from '../pages/beforeYouStart'
import Page from '../pages/page'

import config from '../../server/config'

context('Find Unallocated cases', () => {
  let beforeYouStartPage: BeforeYouStartPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
    cy.visit('/before-you-start')
    beforeYouStartPage = Page.verifyOnPage(BeforeYouStartPage)
  })

  it('Caption text visible on page', () => {
    beforeYouStartPage.captionText().should('contain', 'Allocations')
  })

  it('Legend heading visible on page', () => {
    beforeYouStartPage.headingText().trimTextContent().should('equal', 'Before you start')
  })

  it('Primary nav visible on page', () => {
    beforeYouStartPage
      .primaryNav()
      .should('contain', 'Allocations')
      .and('contain', 'Offender Management')
      .and('contain', 'OMIC')
      .and('contain', 'Courts')
      .and('contain', 'Search')
  })

  it('Primary nav links to wmt', () => {
    beforeYouStartPage
      .navLink('offender-management-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/probation/hmpps/0`)
    beforeYouStartPage.navLink('omic-link').should('equal', `${config.nav.workloadMeasurement.url}/omic/hmpps/0`)
    beforeYouStartPage
      .navLink('courts-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/court-reports/hmpps/0`)
    beforeYouStartPage.navLink('search-link').should('equal', `${config.nav.workloadMeasurement.url}/officer-search`)
  })
})
