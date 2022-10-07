import Page from '../pages/page'
import RegionPage from '../pages/region'

context('Select teams', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
    cy.task('stubUserPreferenceTeams', [])
    cy.task('stubGetAllRegions')
    cy.signIn()
    cy.visit('/regions')
  })

  it('Caption text visible on page', () => {
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage.captionText().should('contain', 'Allocations')
  })

  it('Legend heading visible on page', () => {
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage.legendHeading().trimTextContent().should('equal', 'Select your region')
  })

  it('notification banner visible on page', () => {
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage
      .notificationBanner()
      .should(
        'contain',
        'As this is your first time signing in to Allocations, you need to select the teams you allocate cases to.'
      )
      .and('contain', 'You can edit your team list at any time.')
  })

  it('regions in alphabetical order', () => {
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage
      .radios()
      .getRadios()
      .should('deep.equal', [
        {
          inputValue: 'RG1',
          labelValue: 'A Region',
        },
        {
          inputValue: 'RG2',
          labelValue: 'B Region',
        },
        {
          inputValue: 'RG3',
          labelValue: 'C Region',
        },
        {
          inputValue: 'RG4',
          labelValue: 'D Region',
        },
      ])
  })

  it('continue button exists', () => {
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage.button().trimTextContent().should('equal', 'Continue')
  })
})
