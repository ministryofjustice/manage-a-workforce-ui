import Page, { PageElement } from './page'

export default class ChoosePractitionerPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  sectionBreak = (): PageElement => cy.get('.govuk-section-break')

  subHeading = (): PageElement => cy.get('.govuk-heading-l')

  warningText = (): PageElement => cy.get('.govuk-warning-text')

  warningIcon = (): PageElement => cy.get('.govuk-warning-text__icon')

  table = (): PageElement => cy.get('table')

  checkedRadioButton = (): PageElement => cy.get('input[type="radio"]:checked')

  radioButtons = (): PageElement => cy.get('[type="radio"]')

  allocateCaseButton = (): PageElement => cy.get('form > div > button.govuk-button')

  clearSelectionButton = (): PageElement => cy.get(`.govuk-button--secondary`)
}
