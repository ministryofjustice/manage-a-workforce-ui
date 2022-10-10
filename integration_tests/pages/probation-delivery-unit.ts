import Page, { PageElement } from './page'

export default class ProbationDeliveryUnitPage extends Page {
  constructor(regionName: string) {
    super(regionName)
  }

  legendHeading = (): PageElement => cy.get('.govuk-fieldset__heading')

  radios = (): PageElement => cy.get('.govuk-radios')

  button = (): PageElement => cy.get('.govuk-button')

  cancelLink = (): PageElement => cy.get(`a[href*="/regions"]`)
}
