import Page from '../pages/page'
import ActiveCasesPage from '../pages/activeCases'

context('Active Cases', () => {
  beforeEach(() => {
    cy.task('stubSetup')
  })

  it('Officer details visible on page', () => {
    cy.task('stubGetOffenderManagerCases')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM2/active-cases')
    const activeCasesPage = Page.verifyOnPage(ActiveCasesPage)
    activeCasesPage.captionText().should('contain', 'Wrexham - Team 1')
    activeCasesPage.secondaryText().should('contain', 'PO')
  })

  it('Back link is visible on page', () => {
    cy.task('stubGetOffenderManagerCases')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM2/active-cases')
    const activeCasesPage = Page.verifyOnPage(ActiveCasesPage)
    activeCasesPage.backLink().should('contain', 'Back')
  })

  it('Heading is visible on page', () => {
    cy.task('stubGetOffenderManagerCases')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM2/active-cases')
    const activeCasesPage = Page.verifyOnPage(ActiveCasesPage)
    activeCasesPage.heading().should('contain', 'Active cases')
  })

  it('Active cases tab is highlighted', () => {
    cy.task('stubGetOffenderManagerCases')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM2/active-cases')
    const overviewPage = Page.verifyOnPage(ActiveCasesPage)
    overviewPage.highlightedTab().should('contain.text', 'Active cases').and('not.contain.text', 'Overview')
  })

  it('Table visible on page', () => {
    cy.task('stubGetOffenderManagerCases')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM2/active-cases')
    cy.get('table')
      .getTable()
      .should('deep.equal', [
        {
          'Name / CRN': 'Dylan Adam ArmstrongCRN1111',
          Tier: 'B3',
          'Type of case': 'Custody',
        },
        {
          'Name / CRN': 'Cindy SmithCRN2222',
          Tier: 'A0',
          'Type of case': 'License',
        },
        {
          'Name / CRN': 'CRN3333',
          Tier: 'C2',
          'Type of case': 'Community',
        },
      ])
  })
})
