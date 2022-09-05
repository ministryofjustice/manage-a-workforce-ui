import UnallocatedByTeamPage from '../pages/unallocated-by-team'

context('Unallocated cases by team', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
    cy.signIn()
    cy.task('stubGetAllocationsByTeam', 'TM1')
    cy.task('stubGetTeamByCode', {
      code: 'TM1',
      name: 'Team Name',
    })
    cy.visit('/team/TM1/cases/unallocated')
  })

  it('Probation Delivery Unit visible on page', () => {
    const unallocatedPage = new UnallocatedByTeamPage('Team Name')
    unallocatedPage.probationDeliveryUnit().should('contain.text', 'North Wales')
  })

  it('Sub nav visible on page', () => {
    const unallocatedPage = new UnallocatedByTeamPage('Team Name')
    unallocatedPage.subNav().should('contain', 'Unallocated community cases (8)')
  })

  it('Must show 99+ in subnav when unallocated cases are greater than 99', () => {
    cy.task('stubOverOneHundredAllocationsByTeam', 'TM1')
    cy.visit('/team/TM1/cases/unallocated')
    const unallocatedPage = new UnallocatedByTeamPage('Team Name')
    unallocatedPage.subNavLink().should('contain.text', 'Unallocated community cases (99+)')
  })

  it('Table caption visible on page', () => {
    const unallocatedPage = new UnallocatedByTeamPage('Team Name')
    unallocatedPage.tableCaption().should('have.text', 'Unallocated community cases')
  })

  it('Table visible on page', () => {
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Dylan Adam ArmstrongJ678910',
          Tier: 'C1',
          'Sentence date': '1 Sep 2021',
          'Initial appointment date': '1 Sep 2021',
          'Probation status': 'Currently managed(Antonio LoSardo, SPO)',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sofia MitchellL786545',
          Tier: 'C1',
          'Sentence date': '1 Sep 2021',
          'Initial appointment date': 'Not neededCustody case',
          'Probation status': 'Previously managed(13 Dec 2019)',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'John SmithP125643',
          Tier: 'C3',
          'Sentence date': '23 Jul 2021',
          'Initial appointment date': '17 Aug 2021',
          'Probation status': 'New to probation',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Kacey RayE124321',
          Tier: 'C2',
          'Sentence date': '1 Sep 2021',
          'Initial appointment date': '2 Sep 2021',
          'Probation status': 'New to probation',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Andrew WilliamsP567654',
          Tier: 'C1',
          'Sentence date': '1 Sep 2021',
          'Initial appointment date': '3 Sep 2021',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sarah SiddallC567654',
          Tier: 'C2',
          'Sentence date': '1 Sep 2021',
          'Initial appointment date': '4 Sep 2021',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Mick JonesC234432',
          Tier: 'C1',
          'Sentence date': '25 Aug 2021',
          'Initial appointment date': 'Not foundCheck with your team',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Bill TurnerF5635632',
          Tier: 'D1',
          'Sentence date': '1 Sep 2021',
          'Initial appointment date': '1 Sep 2021',
          'Probation status': 'Currently managed(Richard Moore)',
          Action: 'Review case',
        },
      ])
  })

  it('Unallocated custody cases visible on page', () => {
    const unallocatedPage = new UnallocatedByTeamPage('Team Name')
    unallocatedPage.otherCasesHeading().should('have.text', 'Other types of cases')
  })

  it('Unallocated custody cases warning visible on page', () => {
    const unallocatedPage = new UnallocatedByTeamPage('Team Name')
    unallocatedPage.warningIcon().should('exist')
    unallocatedPage
      .warningText()
      .should('contain', 'You must also check NDelius for any other cases that need to be allocated.')
  })

  it('Should sort tier by correct order', () => {
    const unallocatedPage = new UnallocatedByTeamPage('Team Name')
    unallocatedPage.tierSortButton().click()
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Bill TurnerF5635632',
          Tier: 'D1',
          'Sentence date': '1 Sep 2021',
          'Initial appointment date': '1 Sep 2021',
          'Probation status': 'Currently managed(Richard Moore)',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Dylan Adam ArmstrongJ678910',
          Tier: 'C1',
          'Sentence date': '1 Sep 2021',
          'Initial appointment date': '1 Sep 2021',
          'Probation status': 'Currently managed(Antonio LoSardo, SPO)',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sofia MitchellL786545',
          Tier: 'C1',
          'Sentence date': '1 Sep 2021',
          'Initial appointment date': 'Not neededCustody case',
          'Probation status': 'Previously managed(13 Dec 2019)',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Andrew WilliamsP567654',
          Tier: 'C1',
          'Sentence date': '1 Sep 2021',
          'Initial appointment date': '3 Sep 2021',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Mick JonesC234432',
          Tier: 'C1',
          'Sentence date': '25 Aug 2021',
          'Initial appointment date': 'Not foundCheck with your team',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Kacey RayE124321',
          Tier: 'C2',
          'Sentence date': '1 Sep 2021',
          'Initial appointment date': '2 Sep 2021',
          'Probation status': 'New to probation',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sarah SiddallC567654',
          Tier: 'C2',
          'Sentence date': '1 Sep 2021',
          'Initial appointment date': '4 Sep 2021',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'John SmithP125643',
          Tier: 'C3',
          'Sentence date': '23 Jul 2021',
          'Initial appointment date': '17 Aug 2021',
          'Probation status': 'New to probation',
          Action: 'Review case',
        },
      ])
  })
})
