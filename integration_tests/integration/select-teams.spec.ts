import Page from '../pages/page'
import SelectTeamsPage from '../pages/teams'
import RegionPage from '../pages/region'

context('Select teams', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.signIn()
    cy.visit('/probationDeliveryUnit/PDU1/select-teams')
  })

  it('Caption text visible on page', () => {
    const selectTeamsPage = Page.verifyOnPageTitle(SelectTeamsPage, 'A Probation Delivery Unit')
    selectTeamsPage.captionText().should('contain', 'A Region')
  })

  it('Legend heading visible on page', () => {
    const selectTeamsPage = Page.verifyOnPageTitle(SelectTeamsPage, 'A Probation Delivery Unit')
    selectTeamsPage.legendHeading().trimTextContent().should('equal', 'Select your teams')
  })

  it('hint visible on page', () => {
    const selectTeamsPage = Page.verifyOnPageTitle(SelectTeamsPage, 'A Probation Delivery Unit')
    selectTeamsPage
      .hint()
      .should(
        'contain',
        'Select all the teams you currently allocate cases to. This includes teams you manage and teams you allocate to when on duty.'
      )
      .and('contain', 'You can select more than one team.')
  })

  it('teams in alphabetical order', () => {
    const selectTeamsPage = Page.verifyOnPageTitle(SelectTeamsPage, 'A Probation Delivery Unit')
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
    const selectTeamsPage = Page.verifyOnPageTitle(SelectTeamsPage, 'A Probation Delivery Unit')
    selectTeamsPage.button().trimTextContent().should('equal', 'Continue')
  })

  it('selecting no teams and continuing causes error', () => {
    const selectTeamsPage = Page.verifyOnPageTitle(SelectTeamsPage, 'A Probation Delivery Unit')
    selectTeamsPage.button().click()
    selectTeamsPage
      .errorSummary()
      .trimTextContent()
      .should('equal', 'There is a problem Select the teams you allocate to')
  })

  it('selecting cancel link goes to select region screen', () => {
    cy.task('stubGetAllRegions')
    const selectTeamsPage = Page.verifyOnPageTitle(SelectTeamsPage, 'A Probation Delivery Unit')
    selectTeamsPage.cancelLink().click()
    Page.verifyOnPage(RegionPage)
  })
})
