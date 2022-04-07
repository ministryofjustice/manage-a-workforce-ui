import Page from '../pages/page'
import ActiveCasesPage from '../pages/activeCases'

context('Active Cases', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Officer details visible on page', () => {
    cy.task('stubGetOffenderManagerCases')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/active-cases')
    const activeCasesPage = Page.verifyOnPage(ActiveCasesPage)
    activeCasesPage.captionText().should('contain', 'Wrexham - Team 1')
    activeCasesPage.secondaryText().should('contain', 'PO')
  })

  it('Breadcrumbs are visible on page', () => {
    cy.task('stubGetOffenderManagerCases')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/active-cases')
    const activeCasesPage = Page.verifyOnPage(ActiveCasesPage)
    activeCasesPage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case view')
      .and('contain', 'Allocate to probation practitioner')
  })

  it('Heading is visible on page', () => {
    cy.task('stubGetOffenderManagerCases')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/active-cases')
    const activeCasesPage = Page.verifyOnPage(ActiveCasesPage)
    activeCasesPage.heading().should('contain', 'Active cases')
  })

  it('Table visible on page', () => {
    cy.task('stubGetOffenderManagerCases')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM2/active-cases')
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Dylan Adam ArmstrongCRN1111',
          tier: 'B3',
          'Type of case': 'Custody',
        },
        {
          'Name / CRN': 'Cindy SmithCRN2222',
          tier: 'A0',
          'Type of case': 'License',
        },
      ])
  })
})
