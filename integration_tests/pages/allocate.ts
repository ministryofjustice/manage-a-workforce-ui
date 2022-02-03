import Page, { PageElement } from './page'

export default class AllocatePage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')
}
