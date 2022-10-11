import Page from '../pages/page'
import RegionPage from '../pages/region'
import ProbationDeliveryUnitPage from '../pages/probation-delivery-unit'

context('Select region', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
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

  it('selecting no region and continuing causes error', () => {
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage.button().click()
    regionPage.errorSummary().trimTextContent().should('equal', 'There is a problem Select a region')
  })

  it('selecting region and clicking continue goes to select PDU page', () => {
    cy.task('stubGetRegionByCode')
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage.radio('RG1').click()
    regionPage.button().click()
    Page.verifyOnPageTitle(ProbationDeliveryUnitPage, 'A Region')
  })
})
