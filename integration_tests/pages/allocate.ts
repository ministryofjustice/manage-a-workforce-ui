import Page, { PageElement } from './page'

export default class AllocatePage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  sectionBreak = (): PageElement => cy.get('.govuk-section-break')

  subHeading = (): PageElement => cy.get('.govuk-heading-l')

  warningText = (): PageElement => cy.get('.govuk-warning-text')

  warningIcon = (): PageElement => cy.get('.govuk-warning-text__icon')

  table = (): PageElement => cy.get('table')

  breadCrumbs = (): PageElement => cy.get('.govuk-breadcrumbs__list-item')

  checkedRadioButton = (): PageElement => cy.get('input[type="radio"]:checked')

  radioButtons = (): PageElement => cy.get('[type="radio"]')

  allocateCaseButton = (): PageElement => cy.get('form > div > button.govuk-button')

  errorSummary = (): PageElement => cy.get('.govuk-error-summary')

  clearSelectionButton = (crn, convictionId): PageElement =>
    cy.get(`a[href*="${crn}/convictions/${convictionId}/allocate"]`)
}
