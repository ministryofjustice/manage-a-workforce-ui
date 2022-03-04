import Page, { PageElement } from './page'

export default class OfficerViewPage extends Page {
  constructor() {
    super('John Doe')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')
}
