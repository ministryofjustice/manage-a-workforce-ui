import Page, { PageElement } from './page'

export default class RegionPage extends Page {
  constructor() {
    super('Select your teams')
  }

  legendHeading = (): PageElement => cy.get('.govuk-fieldset__heading')

  radios = (): PageElement => cy.get('.govuk-radios')

  radio = (value: string): PageElement => cy.get(`input[value*="${value}"]`)
}
