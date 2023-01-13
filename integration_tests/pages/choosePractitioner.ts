import Page, { PageElement } from './page'

export default class ChoosePractitionerPage extends Page {
  constructor() {
    super('Choose practitioner')
  }

  warningText = (): PageElement => cy.get('.govuk-warning-text')

  warningIcon = (): PageElement => cy.get('.govuk-warning-text__icon')

  tabs = (): PageElement => cy.get('[data-module="govuk-tabs"]')

  tab = (id: string): PageElement => cy.get(`[id="tab_${id}"]`)

  tabtable = (id: string): PageElement => cy.get(`[id="${id}"]`).find('table')

  table = (): PageElement => cy.get('table')

  checkedRadioButton = (): PageElement => cy.get('input[type="radio"]:checked')

  radioButtons = (): PageElement => cy.get('[type="radio"]')

  radio = (value: string): PageElement => cy.get(`input[value*="${value}"]`)

  allocateCaseButton = (): PageElement => cy.get('form > div > button.govuk-button')

  clearSelectionButton = (): PageElement => cy.get(`.govuk-button--secondary`)
}
