import Page from '../pages/page'
import RegionPage from '../pages/region'
import ProbationDeliveryUnitPage from '../pages/probation-delivery-unit'
import SelectTeamsPage from '../pages/select-teams'

context('Select Probation Delivery Unit', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
    cy.task('stubGetRegionByCode')
    cy.signIn()
    cy.visit('/region/RG1/probationDeliveryUnits')
  })

  it('Caption text visible on page', () => {
    const probationDeliveryUnitPage = Page.verifyOnPageTitle(ProbationDeliveryUnitPage, 'A Region')
    probationDeliveryUnitPage.captionText().should('contain', 'HMPPS')
  })

  it('Legend heading visible on page', () => {
    const probationDeliveryUnitPage = Page.verifyOnPageTitle(ProbationDeliveryUnitPage, 'A Region')
    probationDeliveryUnitPage
      .legendHeading()
      .trimTextContent()
      .should('equal', 'Select your Probation Delivery Unit (PDU)')
  })

  it('PDUs in alphabetical order', () => {
    const probationDeliveryUnitPage = Page.verifyOnPageTitle(ProbationDeliveryUnitPage, 'A Region')
    probationDeliveryUnitPage
      .radios()
      .getRadios()
      .should('deep.equal', [
        {
          inputValue: 'PDU1',
          labelValue: 'A Probation Delivery Unit',
        },
        {
          inputValue: 'PDU2',
          labelValue: 'B Probation Delivery Unit',
        },
        {
          inputValue: 'PDU3',
          labelValue: 'C Probation Delivery Unit',
        },
        {
          inputValue: 'PDU4',
          labelValue: 'D Probation Delivery Unit',
        },
      ])
  })

  it('continue button exists', () => {
    const probationDeliveryUnitPage = Page.verifyOnPageTitle(ProbationDeliveryUnitPage, 'A Region')
    probationDeliveryUnitPage.button().trimTextContent().should('equal', 'Continue')
  })

  it('cancel link goes back to region screen', () => {
    cy.task('stubGetAllRegions')
    const probationDeliveryUnitPage = Page.verifyOnPageTitle(ProbationDeliveryUnitPage, 'A Region')
    probationDeliveryUnitPage.cancelLink().trimTextContent().should('equal', 'Cancel')
    probationDeliveryUnitPage.cancelLink().click()
    Page.verifyOnPage(RegionPage)
  })

  it('selecting no PDU and continuing causes error', () => {
    const probationDeliveryUnitPage = Page.verifyOnPageTitle(ProbationDeliveryUnitPage, 'A Region')
    probationDeliveryUnitPage.button().click()
    probationDeliveryUnitPage
      .errorSummary()
      .trimTextContent()
      .should('equal', 'There is a problem Select a Probation Delivery Unit')
  })

  it('selecting PDU and clicking continue goes to select Team page', () => {
    cy.task('stubGetTeamsByPdu', 'PDU1')
    const probationDeliveryUnitPage = Page.verifyOnPageTitle(ProbationDeliveryUnitPage, 'A Region')
    probationDeliveryUnitPage.radio('PDU1').click()
    probationDeliveryUnitPage.button().click()
    Page.verifyOnPage(SelectTeamsPage)
  })
})
