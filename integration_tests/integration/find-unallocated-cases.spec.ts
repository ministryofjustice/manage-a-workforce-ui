import FindUnallocatedPage from '../pages/findUnallocatedCases'
import Page from '../pages/page'

import config from '../../server/config'

context('Unallocated cases by team', () => {
  let findUnallocatedCasesPage: FindUnallocatedPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
    cy.visit('/probationDeliveryUnit/PDU1/find-unallocated')
    findUnallocatedCasesPage = Page.verifyOnPage(FindUnallocatedPage)
  })

  it('Region visible on page', () => {
    findUnallocatedCasesPage.region().should('contain.text', 'Unallocated Cases')
  })

  it('Primary nav visible on page', () => {
    findUnallocatedCasesPage
      .primaryNav()
      .should('contain', 'Allocations')
      .and('contain', 'Offender Management')
      .and('contain', 'OMIC')
      .and('contain', 'Courts')
      .and('contain', 'Search')
  })

  it('Primary nav links to wmt', () => {
    findUnallocatedCasesPage
      .navLink('offender-management-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/probation/hmpps/0`)
    findUnallocatedCasesPage.navLink('omic-link').should('equal', `${config.nav.workloadMeasurement.url}/omic/hmpps/0`)
    findUnallocatedCasesPage
      .navLink('courts-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/court-reports/hmpps/0`)
    findUnallocatedCasesPage
      .navLink('search-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/officer-search`)
  })

  it('Sub nav visible on page', () => {
    findUnallocatedCasesPage.subNav().should('contain', 'Unallocated community cases')
  })

  it('Shows link to Edit my teams list', () => {
    findUnallocatedCasesPage.manageMyTeamsLink().should('equal', '/probationDeliveryUnit/PDU1/select-teams')
  })
})
