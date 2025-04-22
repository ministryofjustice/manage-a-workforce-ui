import Page from '../pages/page'
import RegionPage from '../pages/region'
import ProbationDeliveryUnitPage from '../pages/probationDeliveryUnit'

context('Select region', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetAllRegions')
    cy.task('stubForNoAllowedRegions', { staffId: 'USER1' })
    cy.signIn()
    cy.visit('/regions')
  })

  it('selecting region and clicking continue goes to select PDU page', () => {
    cy.task('stubGetAllRegions')
    cy.task('stubForNoAllowedRegions', { staffId: 'USER1' })
    cy.task('stubGetRegionDetails')
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage.radio('RG1').should('be.disabled')
    regionPage.radio('RG2').should('be.disabled')
    regionPage.radio('RG3').should('be.disabled')
    regionPage.radio('RG4').should('be.disabled')
  })
})
