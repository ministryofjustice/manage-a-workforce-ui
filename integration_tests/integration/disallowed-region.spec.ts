import Page from '../pages/page'
import RegionPage from '../pages/region'

context('Select region', () => {
  beforeEach(() => {})

  it('Test when that all regions are disabled', () => {
    cy.task('stubSetup')
    cy.task('stubGetAllRegions')
    cy.task('stubForNoAllowedRegions', { staffId: 'USER1' })
    cy.task('stubGetRegionDetails')
    cy.signIn()
    cy.visit('/regions')
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage.radio('RG1').should('be.disabled')
    regionPage.radio('RG2').should('be.disabled')
    regionPage.radio('RG3').should('be.disabled')
    regionPage.radio('RG4').should('be.disabled')
  })

  it('Test when not all regions are enabled', () => {
    cy.task('stubSetup')
    cy.task('stubGetAllRegions')
    cy.task('stubForOneAllowedRegion', { staffId: 'USER1' })
    cy.task('stubGetRegionDetails')
    cy.signIn()
    cy.visit('/regions')
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage.radio('RG1').should('be.disabled')
    regionPage.radio('RG2').should('not.be.disabled')
    regionPage.radio('RG3').should('be.disabled')
    regionPage.radio('RG4').should('be.disabled')
  })
})
