context('Team Workload', () => {
  let teamWorkloadPage

  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.signIn()
    cy.task('stubGetTeamDetails', { code: 'N03F01', name: 'Team Name 1' })
  })

  // stub feature flag call to be added
  // it('Team details visible on page', () => {
  //   cy.task('stubForTeamWorkload')
  //   cy.task('stubWorkloadCases', {
  //     teamCodes: 'N03F01',
  //     response: [
  //       {
  //         teamCode: 'N03F01',
  //         totalCases: 3,
  //         workload: 77,
  //       },
  //     ],
  //   })
  //   cy.visit('/pdu/PDU1/N03F01/reallocations/team-workload')
  //
  //   teamWorkloadPage = Page.verifyOnPage(TeamWorkloadPage)
  //   teamWorkloadPage.captionText().should('contain', 'A Probation Delivery Unit')
  //   teamWorkloadPage.heading().should('contain', 'Team Name 1')
  //   teamWorkloadPage.mediumHeading().should('contain', 'Workload')
  // })
  //
  // it('Officer Links visible on page', () => {
  //   cy.task('stubForTeamWorkload')
  //   cy.task('stubWorkloadCases', {
  //     teamCodes: 'N03F01',
  //     response: [
  //       {
  //         teamCode: 'N03F01',
  //         totalCases: 3,
  //         workload: 77,
  //       },
  //     ],
  //   })
  //   cy.visit('/pdu/PDU1/N03F01/reallocations/team-workload')
  //
  //   teamWorkloadPage = Page.verifyOnPage(TeamWorkloadPage)
  //   teamWorkloadPage.captionText().should('contain', 'A Probation Delivery Unit')
  //   teamWorkloadPage.heading().should('contain', 'Team Name 1')
  //   teamWorkloadPage.mediumHeading().should('contain', 'Workload')
  //   teamWorkloadPage
  //     .officerLink('N03A020')
  //     .should('have.attr', 'href')
  //     .and('include', '/pdu/PDU1/N03F01/reallocations/cases/N03A020')
  // })
  //
  // it('calculates the correct total cases and average workload', () => {
  //   cy.task('stubForTeamWorkload')
  //   cy.task('stubWorkloadCases', {
  //     teamCodes: 'N03F01',
  //     response: [
  //       {
  //         teamCode: 'N03F01',
  //         totalCases: 210,
  //         workload: 75,
  //       },
  //     ],
  //   })
  //   cy.visit('/pdu/PDU1/N03F01/reallocations/team-workload')
  //
  //   teamWorkloadPage = Page.verifyOnPage(TeamWorkloadPage)
  //   teamWorkloadPage.totalCases().should('contain.text', '210')
  //   teamWorkloadPage.averageWorkload().should('contain.text', '75%')
  //   teamWorkloadPage.averageWorkload().should('have.class', 'under-capacity')
  // })
  //
  // it('shows the right number of rows in the table', () => {
  //   cy.task('stubWorkloadCases', {
  //     teamCodes: 'N03F01',
  //     response: [
  //       {
  //         teamCode: 'N03F01',
  //         totalCases: 3,
  //         workload: 77,
  //       },
  //     ],
  //   })
  //   cy.task('stubForTeamWorkload')
  //   cy.visit('/pdu/PDU1/N03F01/reallocations/team-workload')
  //
  //   teamWorkloadPage = Page.verifyOnPage(TeamWorkloadPage)
  //   teamWorkloadPage.teamTableRows().should('have.length', 14)
  //   teamWorkloadPage.teamTableRows().first().should('contain.text', 'Coco Pint')
  //   teamWorkloadPage.teamTableRows().first().should('contain.text', 'PO')
  //   teamWorkloadPage.teamTableRows().first().should('contain.text', '10%')
  // })
  //
  // it('adds the over-capacity class to average workload', () => {
  //   cy.task('stubWorkloadCases', {
  //     teamCodes: 'N03F01',
  //     response: [
  //       {
  //         teamCode: 'N03F01',
  //         totalCases: 3,
  //         workload: 110,
  //       },
  //     ],
  //   })
  //   cy.task('stubForTeamWorkload')
  //   cy.visit('/pdu/PDU1/N03F01/reallocations/team-workload')
  //
  //   teamWorkloadPage = Page.verifyOnPage(TeamWorkloadPage)
  //   cy.task('stubForTeamWorkloadOverCapacity')
  //   cy.visit('/pdu/PDU1/N03F01/reallocations/team-workload')
  //
  //   teamWorkloadPage.averageWorkload().should('have.class', 'over-capacity')
  // })
  //
  // it('filters out 0% workloads', () => {
  //   cy.task('stubWorkloadCases', {
  //     teamCodes: 'N03F01',
  //     response: [
  //       {
  //         teamCode: 'N03F01',
  //         totalCases: 100,
  //         workload: 75,
  //       },
  //     ],
  //   })
  //   cy.task('stubForTeamWorkload')
  //   cy.visit('/pdu/PDU1/N03F01/reallocations/team-workload')
  //
  //   teamWorkloadPage = Page.verifyOnPage(TeamWorkloadPage)
  //   cy.task('stubForTeamWorkloadZeroCapacities')
  //   cy.visit('/pdu/PDU1/N03F01/reallocations/team-workload')
  //
  //   teamWorkloadPage.averageWorkload().should('contain.text', '75%')
  // })
})
