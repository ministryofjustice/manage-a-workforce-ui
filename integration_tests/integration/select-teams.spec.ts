import Page from '../pages/page'
import SelectTeamsPage from '../pages/select-teams'

context('Select teams', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
    cy.task('stubGetTeamsByPdu')
  })

  it('Caption text visible on page', () => {
    cy.signIn()
    cy.visit('/probationDeliveryUnit/PDU1/teams')
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.captionText().should('contain', 'Wales')
  })

  it('Legend heading visible on page', () => {
    cy.signIn()
    cy.visit('/probationDeliveryUnit/PDU1/teams')
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.legendHeading().trimTextContent().should('equal', 'Select your teams')
  })

  it('hint visible on page', () => {
    cy.signIn()
    cy.visit('/probationDeliveryUnit/PDU1/teams')
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage
      .hint()
      .should(
        'contain',
        'Select all the teams you currently allocate cases to. This includes teams you manage and teams you allocate to when on duty.'
      )
      .and('contain', 'You can select more than one team.')
  })

  it('teams in alphabetical order', () => {
    cy.signIn()
    cy.visit('/probationDeliveryUnit/PDU1/teams')
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage
      .checkboxes()
      .getCheckBoxes()
      .should('deep.equal', [
        {
          inputValue: 'TM1',
          labelValue: 'A Team',
        },
        {
          inputValue: 'TM2',
          labelValue: 'B Team',
        },
        {
          inputValue: 'TM3',
          labelValue: 'C Team',
        },
        {
          inputValue: 'TM4',
          labelValue: 'D Team',
        },
      ])
  })

  it('continue button exists', () => {
    cy.signIn()
    cy.visit('/probationDeliveryUnit/PDU1/teams')
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.button().trimTextContent().should('equal', 'Continue')
  })
})
