import UnallocatedPage from '../pages/unallocated'
import AuthSignInPage from '../pages/authSignIn'
import Page from '../pages/page'
import config from '../../server/config'

context('Unallocated', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
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

  it('Notification badge visible on page with number of unallocations', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.notificationsBadge().should('contain.text', '10')
  })

  it('Must show 99+ when unallocated cases are greater than 99', () => {
    cy.task('stubOverOneHundredAllocations')
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.notificationsBadge().should('contain.text', '99+')
  })

  it('Sub nav visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.subNav().should('contain', 'Unallocated community cases (10)')
  })

  it('Must show 99+ in subnav when unallocated cases are greater than 99', () => {
    cy.task('stubOverOneHundredAllocations')
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
          'Induction appointment': '1 Sep 2021Today',
          'Probation status': 'Currently managed(Antonio LoSardo, SPO)',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sofia MitchellL786545',
          Tier: 'C1',
          'Sentence date': '1 Sep 2021',
          'Induction appointment': 'Not needed',
          'Probation status': 'Previously managed(13 Dec 2019)',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'John SmithP125643',
          Tier: 'C3',
          'Sentence date': '23 Jul 2021',
          'Induction appointment': '17 Aug 2021Overdue',
          'Probation status': 'New to probation',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Kacey RayE124321',
          Tier: 'C2',
          'Sentence date': '1 Sep 2021',
          'Induction appointment': '2 Sep 2021Tomorrow',
          'Probation status': 'New to probation',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Andrew WilliamsP567654',
          Tier: 'C1',
          'Sentence date': '1 Sep 2021',
          'Induction appointment': '3 Sep 2021In 2 days',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sarah SiddallC567654',
          Tier: 'C2',
          'Sentence date': '1 Sep 2021',
          'Induction appointment': '4 Sep 2021In 3 days',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Mick JonesC234432',
          Tier: 'C1',
          'Sentence date': '25 Aug 2021',
          'Induction appointment': 'Not bookedDue on 2 Sep 2021',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sarah SmithC254565',
          Tier: 'C1',
          'Sentence date': '24 Aug 2021',
          'Induction appointment': 'Not bookedDue today',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Fiona SipsmithG574565',
          Tier: 'C1',
          'Sentence date': '16 Aug 2021',
          'Induction appointment': 'Not bookedOverdue',
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Bill TurnerF5635632',
          Tier: 'D1',
          'Sentence date': '1 Sep 2021',
          'Induction appointment': '1 Sep 2021Today',
          'Probation status': 'Currently managed(Richard Moore)',
          Action: 'Review case',
        },
      ])
  })

  it('Unallocated custody cases visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.otherCasesHeading().should('have.text', 'Unallocated custody cases')
  })

  it('Unallocated custody cases warning visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.warningIcon().should('exist')
    unallocatedPage
      .warningText()
      .should('contain', 'You must also check NDelius for any custody cases that need to be allocated.')
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
    unallocatedPage
      .secondaryText()
      .should('contain', 'Overdue')
      .and('contain', 'Today')
      .and('contain', 'Tomorrow')
      .and('contain', 'In 2 days')
      .and('contain', 'In 3 days')
  })

  it('Overdue flag is visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.overdueFlag().should('exist')
  })
})
