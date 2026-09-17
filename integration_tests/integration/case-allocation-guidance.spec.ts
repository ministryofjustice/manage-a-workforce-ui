interface TestCase {
  name: string
  expectedHomeLink: string
  setup: () => void
}

describe('Case allocation guidance', () => {
  const testCases: TestCase[] = [
    {
      name: 'From allocations team page',
      expectedHomeLink: '/pdu/PDU1/teams',
      setup: () => {
        cy.task('stubSetup')
        cy.task('stubWorkloadCases', {
          teamCodes: 'TM1',
          response: [
            {
              teamCode: 'TM1',
              totalCases: 2,
              workload: 77,
            },
          ],
        })
        cy.task('stubGetTeamsByCodes', {
          codes: 'TM1',
          response: [
            {
              code: 'TM1',
              name: 'Team 1',
            },
          ],
        })
        cy.task('stubGetPduDetails')
        cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
        cy.signIn()
        cy.visit('/pdu/PDU1/teams')
      },
    },
    {
      name: 'From find unallocated cases page',
      expectedHomeLink: 'pdu/PDU1/find-unallocated',
      setup: () => {
        cy.task('stubSetup')
        cy.task('stubAllEstateByRegionCode')
        cy.task('stubUserPreferenceEmptyAllocationDemand')
        cy.task('stubCaseAllocationHistoryCount', 20)
        cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
        cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
        cy.signIn()
        cy.visit('/pdu/PDU1/find-unallocated')
      },
    },
    {
      name: 'From reallocations page',
      expectedHomeLink: '/pdu/PDU1/reallocations',
      setup: () => {
        cy.task('stubSetup')
        cy.task('stubGetTeamDetails', { code: 'TM2', name: 'Team Name 1' })
        cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
        cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
        cy.task('stubForFeatureflagEnabled')
        cy.signIn()
        cy.visit('/pdu/PDU1/reallocations')
      },
    },
  ]

  testCases.forEach(({ name, expectedHomeLink, setup }) => {
    describe(name, () => {
      beforeEach(() => {
        setup()
      })

      it('should display the tier guidance banner with the correct link', () => {
        cy.get('#tier-banner').should('be.visible')
        cy.get('#tier-banner-header').should('contain.text', 'Changes to tiering model')
        cy.get('#tier-banner-guidance-link')
          .should('contain.text', 'View guidance')
          .and('have.attr', 'href', '/pdu/PDU1/case-allocation-guidance')
      })

      it('should open the guidance page in a new tab', () => {
        cy.get('#tier-banner-guidance-link').invoke('removeAttr', 'target').click()
        cy.url().should('include', '/pdu/PDU1/case-allocation-guidance')
        cy.get('#case-allocation-guidance-page').should('be.visible')
      })

      it('should have the correct back link', () => {
        cy.get('#tier-banner-guidance-link').invoke('removeAttr', 'target').click()
        cy.url().should('include', '/pdu/PDU1/case-allocation-guidance')
        cy.get('#case-allocation-guidance-page').should('be.visible')
        cy.get('.govuk-back-link').should('have.attr', 'href').and('include', expectedHomeLink)
      })
    })
  })
})
