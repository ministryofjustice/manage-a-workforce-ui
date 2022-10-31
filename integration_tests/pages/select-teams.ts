import Page, { PageElement } from './page'

export default class SelectTeamsPage extends Page {
  constructor(title: string) {
    super(title)
  }

  legendHeading = (): PageElement => cy.get('.govuk-fieldset__heading')

  hint = (): PageElement => cy.get('.govuk-hint')

  checkboxes = (): PageElement => cy.get('.govuk-checkboxes')

  checkbox = (id: string): PageElement => cy.get(`#${id}`)

  button = (): PageElement => cy.get('.govuk-button')

  cancelLink = (): PageElement => cy.get(`a[href*="/regions"]`)
}
