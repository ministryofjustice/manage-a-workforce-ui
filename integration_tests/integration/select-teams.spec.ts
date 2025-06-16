import Page from '../pages/page'
import SelectTeamsPage from '../pages/teams'
import RegionPage from '../pages/region'
import ForbiddenPage from '../pages/forbidden'

context('Select teams', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.signIn()
    cy.visit('/pdu/PDU1/select-teams')
  })

  it('Caption text visible on page', () => {
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.captionText().should('contain', 'A Region')
  })

  it('Legend heading visible on page', () => {
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.legendHeading().trimTextContent().should('equal', 'Select your teams')
  })

  it('hint visible on page', () => {
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage
      .hint()
      .should(
        'contain',
        'Select all the teams you currently allocate cases to.  You only need to pick teams that have probation practitioners in them.',
      )
      .and('contain', 'You can select more than one team.')
  })

  it('Show forbidden page if we do not have pdu permission', () => {
    cy.task('stubSetup')
    cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 403 })
    cy.signIn()
    cy.visit('/pdu/PDU1/select-teams', { failOnStatusCode: false })
    const forbiddenPage = Page.verifyOnPage(ForbiddenPage)
    forbiddenPage.message().should('exist')
    forbiddenPage.heading().should('exist')
  })

  it('teams in alphabetical order', () => {
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
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.continueButton().trimTextContent().should('equal', 'Continue')
  })

  it('selecting no teams and continuing causes error', () => {
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.continueButton().click()
    selectTeamsPage
      .errorSummary()
      .trimTextContent()
      .should('equal', 'There is a problem Select the teams you allocate to')
  })

  it('selecting cancel link goes to select your region screen', () => {
    cy.task('stubGetAllRegions')
    cy.task('stubForAllowedRegions', { staffId: 'USER1' })
    const selectTeamsPage = Page.verifyOnPage(SelectTeamsPage)
    selectTeamsPage.cancelLink().click()
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage.legendHeading().trimTextContent().should('equal', 'Select your region')
  })
})
