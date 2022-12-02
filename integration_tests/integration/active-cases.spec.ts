import Page from '../pages/page'
import ActiveCasesPage from '../pages/activeCases'

context('Active Cases', () => {
  let activeCasesPage
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetOffenderManagerCases')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/allocate/OM2/active-cases')
    activeCasesPage = Page.verifyOnPage(ActiveCasesPage)
  })

  it('Officer details visible on page', () => {
    activeCasesPage.captionText().should('contain', 'Wrexham - Team 1')
    activeCasesPage.secondaryText().should('contain', 'PO')
  })

  it('Back link is visible on page', () => {
    activeCasesPage.backLink().should('contain', 'Back')
  })

  it('notification banner is not visible when officer has an email', () => {
    activeCasesPage.notificationBanner().should('not.exist')
  })

  it('notification banner is visible when officer has no email', () => {
    cy.task('stubGetOffenderManagerCasesNoEmail')
    cy.reload()
    activeCasesPage
      .notificationBanner()
      .should(
        'contain',
        'You cannot allocate cases to John Doe through the Allocations tool because they do not have an email address associated with their NDelius account.'
      )
  })

  it('Heading is visible on page', () => {
    activeCasesPage.heading().should('contain', 'Active cases')
  })

  it('Active cases tab is highlighted', () => {
    activeCasesPage.highlightedTab().should('contain.text', 'Active cases').and('not.contain.text', 'Overview')
  })

  it('Table visible on page', () => {
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
