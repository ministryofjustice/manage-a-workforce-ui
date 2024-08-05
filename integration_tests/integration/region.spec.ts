import Page from '../pages/page'
import RegionPage from '../pages/region'
import ProbationDeliveryUnitPage from '../pages/probationDeliveryUnit'

import config from '../../server/config'

context('Select region', () => {
  beforeEach(() => {
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

  it('Primary nav visible on page', () => {
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage
      .primaryNav()
      .should('contain', 'Allocations')
      .and('contain', 'Offender Management')
      .and('contain', 'OMIC')
      .and('contain', 'Courts')
      .and('contain', 'Search')
  })

  it('Primary nav links to wmt', () => {
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage
      .navLink('offender-management-link')
      .should('equal', `${config.nav.workloadMeasurement.url}/probation/hmpps/0`)
    regionPage.navLink('omic-link').should('equal', `${config.nav.workloadMeasurement.url}/omic/hmpps/0`)
    regionPage.navLink('courts-link').should('equal', `${config.nav.workloadMeasurement.url}/court-reports/hmpps/0`)
    regionPage.navLink('search-link').should('equal', `${config.nav.workloadMeasurement.url}/officer-search`)
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

  //  it('selecting no region and continuing causes error', () => {
  //    const regionPage = Page.verifyOnPage(RegionPage)
  //    regionPage.button().click()
  //    regionPage.errorSummary().trimTextContent().should('equal', 'There is a problem Select a region')
  //  })

  //  it('selecting region and clicking continue goes to select PDU page', () => {
  //    cy.task('stubGetRegionDetails')
  //    const regionPage = Page.verifyOnPage(RegionPage)
  //    regionPage.radio('RG1').click()
  //    regionPage.button().click()
  //    Page.verifyOnPage(ProbationDeliveryUnitPage)
  //  })
})
