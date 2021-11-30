import dayjs from 'dayjs'
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
    unallocatedPage.probationDeliveryUnit().should('contain.text', 'Gateshead and South Tyneside')
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
    unallocatedPage.notificationsBadge().should('contain.text', '6')
  })

  it('Must show 99+ when unallocationed cases are greater than 99', () => {
    cy.task('stubOverOneHundredAllocations')
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.notificationsBadge().should('contain.text', '99+')
  })

  it('Sub nav visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.subNav().should('contain', 'Unallocated community cases (6)')
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
          'Sentence date': '17 Oct 2021',
          'Induction appointment': `${dayjs().format('D MMM YYYY')}Today`,
          'Probation status': 'Currently managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sofia MitchellL786545',
          Tier: 'C1',
          'Sentence date': '31 Oct 2021',
          'Induction appointment': 'Not booked',
          'Probation status': 'Previously managed(13 Dec 2019)',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'John SmithP125643',
          Tier: 'C3',
          'Sentence date': '23 Sep 2021',
          'Induction appointment': '15 Oct 2021Overdue',
          'Probation status': 'New to probation',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Kacey RayE124321',
          Tier: 'C2',
          'Sentence date': '23 Nov 2021',
          'Induction appointment': `${dayjs().add(1, 'day').format('D MMM YYYY')}Tomorrow`,
          'Probation status': 'New to probation',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Andrew WilliamsP567654',
          Tier: 'C1',
          'Sentence date': '26 Nov 2021',
          'Induction appointment': `${dayjs().add(2, 'day').format('D MMM YYYY')}In 2 days`,
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
        {
          'Name / CRN': 'Sarah SiddallC567654',
          Tier: 'C2',
          'Sentence date': '26 Nov 2021',
          'Induction appointment': `${dayjs().add(3, 'day').format('D MMM YYYY')}In 3 days`,
          'Probation status': 'Previously managed',
          Action: 'Review case',
        },
      ])
  })

  it('Other Unallocated cases visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage.otherCasesHeading().should('have.text', 'Other unallocated cases')
  })

  it('Other Unallocated cases inset visible on page', () => {
    cy.signIn()
    const unallocatedPage = Page.verifyOnPage(UnallocatedPage)
    unallocatedPage
      .otherCasesInset()
      .should('contain.text', 'There may currently be unallocated custody cases on NDelius.')
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
