import UnallocatedPage from '../pages/unallocatedCasesByTeam'

context('No unallocated cases', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1', response: [] })
    cy.signIn()
    cy.visit('/team/TM1/cases/unallocated')
  })

  it('Sub nav link visible on page with no number', () => {
    const unallocatedPage = new UnallocatedPage('Wrexham - Team 1')
    unallocatedPage.subNavLink().should('have.text', 'Unallocated community cases')
  })

  it('Must show no case list information available', () => {
    const unallocatedPage = new UnallocatedPage('Wrexham - Team 1')
    unallocatedPage.noCaseParagraph().should('have.text', 'No case list information available.')
  })
})
