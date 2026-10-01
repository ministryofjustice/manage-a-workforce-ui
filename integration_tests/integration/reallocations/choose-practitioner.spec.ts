import Page from '../../pages/page'
import ChoosePractitionerPage from '../../pages/choosePractitioner'

context('Reallocation Choose Practitioner', () => {
  let choosePractitionerPage

  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
    cy.task('stubUserPreferenceTeams', ['N03F01', 'N03F02'])
    cy.task('stubForLaoStatus', { crn: 'J678910', response: false })
    cy.task('stubGetCrnAccess', { crn: 'J678910', userId: 'USER1', allowed: true })
    cy.task('stubChoosePractitioners', {})
    cy.task('stubGetTeamsByCodes', {
      codes: 'N03F01,N03F02',
      response: [
        {
          code: 'N03F01',
          name: 'Team 1',
        },
        {
          code: 'N03F02',
          name: 'Team 2',
        },
      ],
    })
    cy.task('stubWorkloadCases', {
      teamCodes: 'N03F01,N03F02',
      response: [
        {
          teamCode: 'N03F01',
          totalCases: 3,
          workload: 77,
        },
        {
          teamCode: 'N03F02',
          totalCases: 7,
          workload: 85,
        },
      ],
    })
  })

  it('Workload details visible on page', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/reallocations/choose-practitioner')
    choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)

    choosePractitionerPage.practitionersTable().should('be.visible')
    choosePractitionerPage.workloadWrapper().should('be.visible')

    choosePractitionerPage.rows().eq(1).should('contain', 'Jim Jam')
    choosePractitionerPage.visuallyHidden().eq(0).should('contain', 'Select Jim Jam to allocate to')
    choosePractitionerPage.visuallyHidden().eq(1).should('contain', 'Jim Jam’s workload')

    choosePractitionerPage.rows().eq(2).should('contain', 'Jane Doe')
    choosePractitionerPage.visuallyHidden().eq(2).should('contain', 'Select Jane Doe to allocate to')
    choosePractitionerPage.visuallyHidden().eq(3).should('contain', 'Jane Doe’s workload')

    choosePractitionerPage.rows().eq(3).should('contain', 'Sam Smam')
    choosePractitionerPage.visuallyHidden().eq(4).should('contain', 'Sam Smam’s workload')
  })

  it('should display all practitioners when selecting all teams after selecting another team', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/reallocations/choose-practitioner')
    choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)

    choosePractitionerPage.tab('N03F01').click()
    choosePractitionerPage.tabtable().get('tr.govuk-visually-hidden').eq(0).should('contain.text', 'Jim Jam')
    choosePractitionerPage.tabtable().get('tr:not(.govuk-visually-hidden').eq(1).should('contain', 'Jane Doe')
    choosePractitionerPage.tabtable().get('tr.govuk-visually-hidden').eq(1).should('contain.text', 'Sam Smam')

    choosePractitionerPage.tab('ALL-TEAMS').click()
    choosePractitionerPage.tabtable().get('tr:not(.govuk-visually-hidden').eq(1).should('contain.text', 'Jim Jam')
    choosePractitionerPage.tabtable().get('tr:not(.govuk-visually-hidden').eq(2).should('contain', 'Jane Doe')
    choosePractitionerPage.tabtable().get('tr:not(.govuk-visually-hidden').eq(3).should('contain.text', 'Sam Smam')
  })

  it('Missing tier in header should display red tag', () => {
    cy.task('stubChoosePractitioners', { tier: 'MISSING' })
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/reallocations/choose-practitioner')
    choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.redMissingTag().should('contain', 'Missing')
    choosePractitionerPage.tagCaption().should('contain', 'Tier cannot be calculated as key assessment data missing')
  })

  it('Provisional tier in header should display orange tag', () => {
    cy.task('stubChoosePractitioners', { provisionalTier: true })
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/reallocations/choose-practitioner')
    choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.orangeProvisionalTag().should('contain', 'Provisional')
    choosePractitionerPage
      .tagCaption()
      .should('contain', 'Tier is provisional until dynamic CSRP completed and ROSH confirmed')
  })
})
