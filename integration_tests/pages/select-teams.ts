import Page, { PageElement } from './page'

export default class SelectTeamsPage extends Page {
  constructor() {
    super('North Wales')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  legendHeading = (): PageElement => cy.get('.govuk-fieldset__heading')

  hint = (): PageElement => cy.get('.govuk-hint')

  checkboxes = (): PageElement => cy.get('.govuk-checkboxes')

  button = (): PageElement => cy.get('.govuk-button')
}
