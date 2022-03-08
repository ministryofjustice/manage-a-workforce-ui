import Page, { PageElement } from './page'

export default class OfficerViewPage extends Page {
  constructor() {
    super('John Doe')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  breadCrumbs = (): PageElement => cy.get('.govuk-breadcrumbs__list-item')

  secondaryText = (): PageElement => cy.get('.maw-secondary-text-col')
}
