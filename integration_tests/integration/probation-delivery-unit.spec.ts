import Page from '../pages/page'
import ProbationDeliveryUnitPage from '../pages/probationDeliveryUnit'
import SelectTeamsPage from '../pages/teams'
import RegionPage from '../pages/region'

context('Select Probation Delivery Unit', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetRegionDetails')
    cy.signIn()
    cy.visit('/region/RG1/probationDeliveryUnits')
  })

  it('Caption text visible on page', () => {
    const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
    probationDeliveryUnitPage.captionText().should('contain', 'HMPPS')
  })

  it('Legend heading visible on page', () => {
    const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
    probationDeliveryUnitPage
      .legendHeading()
      .trimTextContent()
      .should('equal', 'Select your probation delivery unit (PDU)')
  })

  it('PDUs in alphabetical order', () => {
    const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
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
    const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
    probationDeliveryUnitPage.continueButton().trimTextContent().should('equal', 'Continue')
  })

  it('cancel link goes back to select your region screen', () => {
    cy.task('stubGetAllRegions')
    const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
    probationDeliveryUnitPage.cancelLink().trimTextContent().should('equal', 'Cancel')
    probationDeliveryUnitPage.cancelLink().click()
    const regionPage = Page.verifyOnPage(RegionPage)
    regionPage.legendHeading().trimTextContent().should('equal', 'Select your region')
  })

  it('selecting no PDU and continuing causes error', () => {
    const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
    probationDeliveryUnitPage.continueButton().click()
    probationDeliveryUnitPage
      .errorSummary()
      .trimTextContent()
      .should('equal', 'There is a problem Select a probation delivery unit')
  })

  it('selecting PDU and clicking continue goes to select Team page', () => {
    cy.task('stubGetPduDetails', 'PDU1')
    const probationDeliveryUnitPage = Page.verifyOnPage(ProbationDeliveryUnitPage)
    probationDeliveryUnitPage.radio('PDU1').click()
    probationDeliveryUnitPage.continueButton().click()
    Page.verifyOnPage(SelectTeamsPage)
  })
})
