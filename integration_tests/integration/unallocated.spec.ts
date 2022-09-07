import UnallocatedPage from '../pages/unallocated'
import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import config from '../../server/config'

context('Unallocated', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    const authPage = new AuthSignInPage()
    authPage.checkOnPage()
  })

  it('User name visible in header', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.headerUserName().should('contain.text', 'J. Smith')
  })

  it('Feedback link goes to Manage a Workforce mailbox', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.feedbackLink().should('have.attr', 'href').and('equal', 'mailto:manageaworkforce@justice.gov.uk')
  })

  it('Probation Delivery Unit visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.probationDeliveryUnit().should('contain.text', 'North Wales')
  })

  it('Primary nav visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage
      .primaryNav()
      .should('contain', 'Allocations')
      .and('contain', 'Offender Management')
      .and('contain', 'OMIC')
      .and('contain', 'Courts')
      .and('contain', 'Search')
  })

  it('Primary nav links to wmt', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage
      .navLink('offender-management-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/probation/hmpps/0`)
    unallocatedPage.navLink('omic-link').should('equal', `${config.nav.workloadMeasurement.url}/omic/hmpps/0`)
    unallocatedPage
      .navLink('courts-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/court-reports/hmpps/0`)
    unallocatedPage.navLink('search-link').should('equal', `${config.nav.workloadMeasurement.url}/officer-search`)
  })

  it('redirects to Wrexham team 1', () => {
    cy.signIn()
    cy.url().should('include', '/team/N03F01/cases/unallocated')
  })

  it('Sub nav visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.subNav().should('contain', 'Unallocated community cases (8)')
  })

  it('Must show 99+ in subnav when unallocated cases are greater than 99', () => {
    cy.task('stubOverOneHundredAllocationsByTeam', 'N03F01')
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.subNavLink().should('contain.text', 'Unallocated community cases (99+)')
  })

  it('Table caption visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.tableCaption().should('have.text', 'Unallocated community cases')
  })

  it('Table visible on page', () => {
    cy.signIn()
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
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.otherCasesHeading().should('have.text', 'Other types of cases')
  })

  it('Unallocated custody cases warning visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.warningIcon().should('exist')
    unallocatedPage
      .warningText()
      .should('contain', 'You must also check NDelius for any other cases that need to be allocated.')
  })

  it('User can log out', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.signOut().click()
    const authPage = new AuthSignInPage()
    authPage.checkOnPage()
  })

  it('Footer visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage
      .footer()
      .should('contain', 'Accessibility statement')
      .and('contain', 'Cookies')
      .and('contain', 'Privacy')
      .and('contain', 'Open Government Licence v3.0')
      .and('contain', '© Crown copyright')
  })

  it('Secondary text is visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.secondaryText().should('contain', 'Custody case').and('contain', 'Check with your team')
  })

  it('Should sort tier by correct order', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
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
