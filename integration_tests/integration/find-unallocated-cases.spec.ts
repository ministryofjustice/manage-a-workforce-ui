import FindUnallocatedPage from '../pages/findUnallocatedCases'
import Page from '../pages/page'

import config from '../../server/config'

context('Find Unallocated cases', () => {
  let findUnallocatedCasesPage: FindUnallocatedPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubAllEstateByRegionCode')
    cy.task('stubUserPreferenceEmptyAllocationDemand')
    cy.signIn()
    cy.visit('/probationDeliveryUnit/PDU1/find-unallocated')
    findUnallocatedCasesPage = Page.verifyOnPage(FindUnallocatedPage)
  })

  it('Region visible on page', () => {
    findUnallocatedCasesPage.region().should('contain.text', 'A Region')
  })

  it('Probation Delivery Unit name visible on page', () => {
    findUnallocatedCasesPage.probationDeliveryUnit().should('contain.text', 'A Probation Delivery Unit')
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

  it('already having allocation demand saved selects the correct PDU, LDU, and team from drop downs', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1' })
    cy.reload()
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('First Probation Delivery Unit')
    findUnallocatedCasesPage.select('ldu').find(':selected').contains('First Local Delivery Unit')
    findUnallocatedCasesPage.select('team').find(':selected').contains('First Team')
  })

  it('allocation demand selection in different estate has default options selected', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU3', lduCode: 'LDU5', teamCode: 'TM9' })
    cy.reload()
    findUnallocatedCasesPage.select('pdu').find(':selected').contains('Select PDU')
    findUnallocatedCasesPage.select('ldu').find(':selected').contains('Select LDU')
    findUnallocatedCasesPage.select('team').find(':selected').contains('Select team')
  })

  it('retrieve allocation demand for team saved in user preference allocation demand', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1' })
    cy.reload()
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Dylan Adam ArmstrongJ678910',
          Tier: 'C1',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '1 September 2021',
          'Probation status': 'Currently managed(Antonio LoSardo, SPO)',
        },
        {
          'Name / CRN': 'Sofia MitchellL786545',
          Tier: 'C1',
          'Sentence date': '1 September 2021',
          'Initial appointment date': 'Not neededCustody case (32 Years)',
          'Probation status': 'Previously managed(John Agard)',
        },
        {
          'Name / CRN': 'John SmithP125643',
          Tier: 'C3',
          'Sentence date': '23 July 2021',
          'Initial appointment date': '17 August 2021',
          'Probation status': 'New to probation',
        },
        {
          'Name / CRN': 'Kacey RayE124321',
          Tier: 'C2',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '2 September 2021',
          'Probation status': 'New to probation',
        },
        {
          'Name / CRN': 'Andrew WilliamsP567654',
          Tier: 'C1',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '3 September 2021',
          'Probation status': 'Previously managed',
        },
        {
          'Name / CRN': 'Sarah SiddallC567654',
          Tier: 'C2',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '4 September 2021',
          'Probation status': 'Previously managed',
        },
        {
          'Name / CRN': 'Mick JonesC234432',
          Tier: 'C1',
          'Sentence date': '25 August 2021',
          'Initial appointment date': 'Not foundCheck with your team',
          'Probation status': 'Previously managed',
        },
        {
          'Name / CRN': 'Bill TurnerF5635632',
          Tier: 'D1',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '1 September 2021',
          'Probation status': 'Currently managed(Richard Moore)',
        },
      ])
  })
  it('clicking clear link removes user preference', () => {
    cy.task('stubPutEmptyUserPreferenceAllocationDemand')
    findUnallocatedCasesPage.clearLink().click()
    cy.task('verifyClearUserPreferenceAllocationDemand')
  })

  it('Sub nav visible on page with case count', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1' })
    cy.reload()
    findUnallocatedCasesPage.subNav().should('contain', 'Unallocated community cases (8)')
  })

  it('Must show 99+ in subnav when unallocated cases are greater than 99', () => {
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubOverOneHundredAllocationsByTeam', 'TM1')
    cy.reload()
    findUnallocatedCasesPage.subNavLink().should('contain.text', 'Unallocated community cases (99+)')
  })

  it('no table or content exists before save', () => {
    cy.get('table').should('not.exist')
    findUnallocatedCasesPage.noCasesBody().should('not.exist')
  })
})
