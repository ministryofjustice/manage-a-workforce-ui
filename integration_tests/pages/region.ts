import Page, { PageElement } from './page'

export default class RegionPage extends Page {
  constructor() {
    super('Select your teams')
  }

  legendHeading = (): PageElement => cy.get('.govuk-fieldset__heading')

  notificationBanner = (): PageElement => cy.get('.govuk-notification-banner')

  radios = (): PageElement => cy.get('.govuk-radios')

  radio = (id: string): PageElement => cy.get(`#${id}`)

  button = (): PageElement => cy.get('.govuk-button')
}
