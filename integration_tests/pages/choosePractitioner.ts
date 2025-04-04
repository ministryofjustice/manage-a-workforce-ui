import Page, { PageElement } from './page'

export default class ChoosePractitionerPage extends Page {
  constructor() {
    super('Choose practitioner')
  }

  restrictedStatusBadge = (): PageElement => cy.get('.govuk-body.govuk-tag--orange')

  warningText = (): PageElement => cy.get('.govuk-warning-text')

  warningIcon = (): PageElement => cy.get('.govuk-warning-text__icon')

  captionText = (): PageElement => cy.get('.govuk-caption-l')

  tabs = (): PageElement => cy.get('[data-module="govuk-tabs"]')

  tab = (id: string): PageElement => cy.get(`[id="tab_${id}"]`)

  tabtable = (id: string): PageElement => cy.get(`[id="${id}"]`).find('table')

  officerLink = (id: string): PageElement => cy.get(`[data-qa-link="${id}"]`)

  table = (): PageElement => cy.get('table')

  checkedRadioButton = (): PageElement => cy.get('input[type="radio"]:checked')

  radioButtons = (): PageElement => cy.get('[type="radio"]')

  radio = (value: string): PageElement => cy.get(`input[value*="${value}"]`)

  allocateCaseButton = (): PageElement => cy.get('form > div > button.govuk-button')

  clearSelectionButton = (): PageElement => cy.get(`#clearSelection`)

  manageMyTeamsLink = (): PageElement => cy.get('[data-qa-link="select-teams"]').invoke('attr', 'href')
}
