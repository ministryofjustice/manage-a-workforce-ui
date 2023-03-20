import dayjs from 'dayjs'
import CaseAllocationHistoryPage from '../pages/caseAllocationHistory'
import Page from '../pages/page'

import config from '../../server/config'

context('Case allocation history', () => {
  let caseAllocationHistoryPage: CaseAllocationHistoryPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubCaseAllocationHistory')
    cy.signIn()
    cy.visit('/pdu/PDU1/case-allocation-history')
    caseAllocationHistoryPage = Page.verifyOnPage(CaseAllocationHistoryPage)
  })

  it('Region visible on page', () => {
    caseAllocationHistoryPage.region().should('contain.text', 'A Region')
  })

  it('Probation Delivery Unit name visible on page', () => {
    caseAllocationHistoryPage.probationDeliveryUnit().should('contain.text', 'A Probation Delivery Unit')
  })

  it('Primary nav visible on page', () => {
    caseAllocationHistoryPage
      .primaryNav()
      .should('contain', 'Allocations')
      .and('contain', 'Offender Management')
      .and('contain', 'OMIC')
      .and('contain', 'Courts')
      .and('contain', 'Search')
  })

  it('Primary nav links to wmt', () => {
    caseAllocationHistoryPage
      .navLink('offender-management-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/probation/hmpps/0`)
    caseAllocationHistoryPage.navLink('omic-link').should('equal', `${config.nav.workloadMeasurement.url}/omic/hmpps/0`)
    caseAllocationHistoryPage
      .navLink('courts-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/court-reports/hmpps/0`)
    caseAllocationHistoryPage
      .navLink('search-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/officer-search`)
  })

  it('Shows link to Edit my teams list', () => {
    caseAllocationHistoryPage.manageMyTeamsLink().should('equal', '/pdu/PDU1/select-teams')
  })

  it('Sub nav visible on page with case count', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1' })
    cy.reload()
    caseAllocationHistoryPage
      .subNav()
      .should('contain', 'Cases allocated in last 30 days (2)')
      // TODO - Add unallocated cases count
      .and('contain', 'Unallocated community cases')
  })

  it('Must show 99+ in subnav when unallocated cases are greater than 99', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetUnallocatedCasesByTeams', {
      teamCodes: 'TM1',
      response: [
        {
          teamCode: 'TM1',
          caseCount: 100,
        },
      ],
    })
    cy.reload()
    caseAllocationHistoryPage.subNavLink().should('contain.text', 'Unallocated community cases (99+)')
  })

  it('Must show 99+ in subnav when cases allocated in last 30 days are greater than 99', () => {
    cy.task('stubOverOneHundredCaseAllocationHistory')
    cy.reload()
    caseAllocationHistoryPage.subNavLink().should('contain.text', 'Cases allocated in last 30 days (99+)')
  })

  it('large heading visible on page', () => {
    caseAllocationHistoryPage
      .largeHeading()
      .should('contain', 'Cases allocated through the Allocations tool in the last 30 days')
  })

  it('last updated date and time visible on page', () => {
    const expectedLastUpdatedDate = dayjs(new Date().toDateString()).format('D MMMM YYYY')
    caseAllocationHistoryPage.largeHeadingSecondaryText().should('contain', `Last updated: ${expectedLastUpdatedDate}`)
  })

  it('requested start date is 30 days ago', () => {
    const date = new Date()
    date.setDate(date.getDate() - 30)
    const thirtyDaysAgoString = date.toISOString().replace(/T.*$/, '')
    cy.task('verifyAllocationHistoryRequest', thirtyDaysAgoString)
  })

  it('case allocation history table shows the correct data', () => {
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Stacy KoeppX602047',
          Tier: 'C1',
          'Date allocated': '2 February 2023',
          'Probation Practitioner': 'Steve Leave',
        },
        {
          'Name / CRN': 'Terrance YundtX602070',
          Tier: 'D0',
          'Date allocated': '3 March 2023',
          'Probation Practitioner': 'Andy Pandy',
        },
      ])
  })

  it('shows message but no table is shown if no data returned', () => {
    cy.task('stubCaseAllocationHistoryEmpty')
    cy.reload()
    cy.get('table').should('not.exist')
    caseAllocationHistoryPage.noCasesBody().should('exist')
    caseAllocationHistoryPage.noCasesBody().should('contain.text', 'There are no cases allocated in the past 30 days.')
  })

  it('This tab is highlighted', () => {
    caseAllocationHistoryPage
      .highlightedTab()
      .should('contain.text', 'Cases allocated in last 30 days')
      .and('not.contain.text', 'Unallocated community cases')
  })

  it('navigate to find unallocated cases page via sub nav', () => {
    caseAllocationHistoryPage.unallocatedCasesSubNavLink().click()
    cy.url().should('contain', 'pdu/PDU1/find-unallocated')
  })
})
