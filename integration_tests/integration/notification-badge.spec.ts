import SummaryPage from '../pages/summary'
import AllocateCasesByTeamPage from '../pages/allocateCasesByTeam'
import Page from '../pages/page'

context('Unallocated', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
  })

  it('Notification badge visible on page with number of unallocated cases', () => {
    const unallocatedPage = Page.verifyOnPage(AllocateCasesByTeamPage)
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
    const unallocatedPage = Page.verifyOnPage(AllocateCasesByTeamPage)
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
    const unallocatedPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    unallocatedPage.notificationsBadge().should('not.exist')
  })

  it('must not show notification badge when no user preference is selected', () => {
    cy.task('stubUserPreferenceTeams', [])
    cy.reload()
    const unallocatedPage = Page.verifyOnPage(AllocateCasesByTeamPage)
    unallocatedPage.notificationsBadge().should('not.exist')
  })

  it('must show + when erroring retrieving unallocated case count', () => {
    cy.task('stubUserPreferenceTeamsError')
    cy.task('stubGetUnallocatedCase')
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.notificationsBadge().should('contain.text', '+')
  })
})
