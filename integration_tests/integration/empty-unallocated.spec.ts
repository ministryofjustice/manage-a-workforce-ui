import UnallocatedPage from '../pages/unallocated-by-team'

context('No unallocated cases', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
    cy.task('stubGetAllocationsByTeam', { teamCode: 'N03F01', response: [] })
    cy.signIn()
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
