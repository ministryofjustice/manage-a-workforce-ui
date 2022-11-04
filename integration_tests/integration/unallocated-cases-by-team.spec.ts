import UnallocatedByTeamPage from '../pages/unallocatedCasesByTeam'

import config from '../../server/config'

context('Unallocated cases by team', () => {
  let unallocatedPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1' })
    cy.task('stubGetTeamDetails', {
      code: 'TM1',
      name: 'Team Name',
    })
    cy.visit('/team/TM1/cases/unallocated')
    unallocatedPage = new UnallocatedByTeamPage('Team Name')
  })

  it('Probation Delivery Unit visible on page', () => {
    unallocatedPage.probationDeliveryUnit().should('contain.text', 'A Probation Delivery Unit')
  })

  it('Primary nav visible on page', () => {
    unallocatedPage
      .primaryNav()
      .should('contain', 'Allocations')
      .and('contain', 'Offender Management')
      .and('contain', 'OMIC')
      .and('contain', 'Courts')
      .and('contain', 'Search')
  })

  it('Primary nav links to wmt', () => {
    unallocatedPage
      .navLink('offender-management-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/probation/hmpps/0`)
    unallocatedPage.navLink('omic-link').should('equal', `${config.nav.workloadMeasurement.url}/omic/hmpps/0`)
    unallocatedPage
      .navLink('courts-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/court-reports/hmpps/0`)
    unallocatedPage.navLink('search-link').should('equal', `${config.nav.workloadMeasurement.url}/officer-search`)
  })

  it('Sub nav visible on page', () => {
    unallocatedPage.subNav().should('contain', 'Unallocated community cases (8)')
  })

  it('Must show 99+ in subnav when unallocated cases are greater than 99', () => {
    cy.task('stubOverOneHundredAllocationsByTeam', 'TM1')
    cy.visit('/team/TM1/cases/unallocated')
    unallocatedPage.subNavLink().should('contain.text', 'Unallocated community cases (99+)')
  })

  it('Table caption visible on page', () => {
    unallocatedPage.tableCaption().should('have.text', 'Unallocated community cases')
  })

  it('Table visible on page', () => {
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Dylan Adam ArmstrongJ678910',
          Tier: 'C1',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '1 September 2021',
          'Probation status': 'Currently managed(Antonio LoSardo, SPO)',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sofia MitchellL786545',
          Tier: 'C1',
          'Sentence date': '1 September 2021',
          'Initial appointment date': 'Not neededCustody case (32 Years)',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'John SmithP125643',
          Tier: 'C3',
          'Sentence date': '23 July 2021',
          'Initial appointment date': '17 August 2021',
          'Probation status': 'New to probation',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Kacey RayE124321',
          Tier: 'C2',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '2 September 2021',
          'Probation status': 'New to probation',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Andrew WilliamsP567654',
          Tier: 'C1',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '3 September 2021',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sarah SiddallC567654',
          Tier: 'C2',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '4 September 2021',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Mick JonesC234432',
          Tier: 'C1',
          'Sentence date': '25 August 2021',
          'Initial appointment date': 'Not foundCheck with your team',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Bill TurnerF5635632',
          Tier: 'D1',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '1 September 2021',
          'Probation status': 'Currently managed(Richard Moore)',
          Action: 'Review case',
        },
      ])
  })

  it('Unallocated custody cases visible on page', () => {
    unallocatedPage.otherCasesHeading().should('have.text', 'Other types of cases')
  })

  it('Unallocated custody cases warning visible on page', () => {
    unallocatedPage.warningIcon().should('exist')
    unallocatedPage
      .warningText()
      .should('contain', 'You must also check NDelius for any other cases that need to be allocated.')
  })

  it('Secondary text is visible on page', () => {
    unallocatedPage.secondaryText().should('contain', 'Custody case').and('contain', 'Check with your team')
  })

  it('Should sort tier by correct order', () => {
    unallocatedPage.tierSortButton().click()
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Bill TurnerF5635632',
          Tier: 'D1',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '1 September 2021',
          'Probation status': 'Currently managed(Richard Moore)',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Dylan Adam ArmstrongJ678910',
          Tier: 'C1',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '1 September 2021',
          'Probation status': 'Currently managed(Antonio LoSardo, SPO)',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sofia MitchellL786545',
          Tier: 'C1',
          'Sentence date': '1 September 2021',
          'Initial appointment date': 'Not neededCustody case (32 Years)',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Andrew WilliamsP567654',
          Tier: 'C1',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '3 September 2021',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Mick JonesC234432',
          Tier: 'C1',
          'Sentence date': '25 August 2021',
          'Initial appointment date': 'Not foundCheck with your team',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Kacey RayE124321',
          Tier: 'C2',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '2 September 2021',
          'Probation status': 'New to probation',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sarah SiddallC567654',
          Tier: 'C2',
          'Sentence date': '1 September 2021',
          'Initial appointment date': '4 September 2021',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'John SmithP125643',
          Tier: 'C3',
          'Sentence date': '23 July 2021',
          'Initial appointment date': '17 August 2021',
          'Probation status': 'New to probation',
          Action: 'Review case',
        },
      ])
  })

  it('link to case overview in table', () => {
    unallocatedPage.tableLink('123456789').should('equal', '/team/TM1/J678910/convictions/123456789/case-view')
  })

  it('Shows link to Manage my teams', () => {
    unallocatedPage.manageMyTeamsLink().should('equal', '/probationDeliveryUnit/PDU1/select-teams')
  })
})
