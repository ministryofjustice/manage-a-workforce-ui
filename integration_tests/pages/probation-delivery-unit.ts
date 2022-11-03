import Page, { PageElement } from './page'

export default class ProbationDeliveryUnitPage extends Page {
  constructor(regionName: string) {
    super(regionName)
  }

  legendHeading = (): PageElement => cy.get('.govuk-fieldset__heading')

  radios = (): PageElement => cy.get('.govuk-radios')

  cancelLink = (): PageElement => cy.get(`a[href*="/regions"]`)

  radio = (value: string): PageElement => cy.get(`input[value*="${value}"]`)
}
