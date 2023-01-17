import FindUnallocatedPage from '../pages/findUnallocatedCases'
import Page from '../pages/page'

import config from '../../server/config'

context('Find Unallocated cases', () => {
  let findUnallocatedCasesPage: FindUnallocatedPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubAllEstateByRegionCode')
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

  it('large heading visible on page', () => {
    findUnallocatedCasesPage.largeHeading().should('contain', 'Unallocated community cases')
  })

  it('filter heading visible on page', () => {
    findUnallocatedCasesPage.filterHeading().should('contain', 'Select a team to view unallocated case')
  })

  it('select pdu visible on page', () => {
    findUnallocatedCasesPage.selectLabel('pdu').should('contain', 'Probation delivery unit (PDU)')
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('Select PDU')
  })

  it('select ldu visible on page', () => {
    findUnallocatedCasesPage.selectLabel('ldu').should('contain', 'Local delivery unit (LDU)')
    findUnallocatedCasesPage.select('ldu').find(':selected').contains('Select LDU')
  })

  it('select team visible on page', () => {
    findUnallocatedCasesPage.selectLabel('team').should('contain', 'Team')
    findUnallocatedCasesPage.select('team').find(':selected').contains('Select team')
  })

  it('save and view selection button visible', () => {
    findUnallocatedCasesPage.saveViewButton().should('contain', 'Save and view selection')
  })

  it('clear link visible', () => {
    findUnallocatedCasesPage.clearLink().should('contain', 'Clear')
  })

  it('all options exist for PDUs', () => {
    findUnallocatedCasesPage
      .select('pdu')
      .getOptions()
      .should('deep.equal', [
        {
          optionValue: '',
          optionContent: 'Select PDU',
        },
        {
          optionValue: 'PDU1',
          optionContent: 'First Probation Delivery Unit',
        },
        {
          optionValue: 'PDU2',
          optionContent: 'Second Probation Delivery Unit',
        },
      ])
  })
})
