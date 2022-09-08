import UnallocatedPage from '../pages/unallocated-by-team'
import Page from '../pages/page'

context('Unallocated', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
    cy.signIn()
  })

  it('Notification badge visible on page with number of unallocated cases', () => {
    const unallocatedPage = new UnallocatedPage('Wrexham - Team 1')
    unallocatedPage.notificationsBadge().should('contain.text', '10')
  })

  it('Must show 99+ when unallocated cases are greater than 99', () => {
    cy.task('stubGetUnallocatedCasesByTeams', {
      teamCodes: 'TM1',
      response: [
        {
          teamCode: 'TM1',
          caseCount: 100,
        },
      ],
    })
    cy.reload()
    const unallocatedPage = new UnallocatedPage('Wrexham - Team 1')
    unallocatedPage.notificationsBadge().should('contain.text', '99+')
  })

  it('Must not show the notifications badge when no unallocated cases exist', () => {
    cy.task('stubGetUnallocatedCasesByTeams', {
      teamCodes: 'TM1',
      response: [
        {
          teamCode: 'TM1',
          caseCount: 0,
        },
      ],
    })
    cy.reload()
    const unallocatedPage = new UnallocatedPage('Wrexham - Team 1')
    unallocatedPage.notificationsBadge().should('not.exist')
  })

  it('must be backwards compatible, no user preference selected gets Wrexham Team 1 unallocated case count', () => {
    cy.task('stubUserPreferenceTeams', [])
    cy.task('stubGetUnallocatedCasesByTeams', {
      teamCodes: 'N03F01',
      response: [
        {
          teamCode: 'N03F01',
          caseCount: 20,
        },
      ],
    })
    cy.reload()
    const unallocatedPage = new UnallocatedPage('Wrexham - Team 1')
    unallocatedPage.notificationsBadge().should('contain.text', '20')
  })
})
