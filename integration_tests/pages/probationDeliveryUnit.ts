import Page, { PageElement } from './page'

export default class ProbationDeliveryUnitPage extends Page {
  constructor() {
    super('Select your PDU')
  }

  legendHeading = (): PageElement => cy.get('.govuk-fieldset__heading')

  radios = (): PageElement => cy.get('.govuk-radios')

  cancelLink = (): PageElement => cy.get(`a[href*="/before-you-start"]`)

  radio = (value: string): PageElement => cy.get(`input[value*="${value}"]`)
}
