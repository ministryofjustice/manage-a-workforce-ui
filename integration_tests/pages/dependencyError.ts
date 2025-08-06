import Page, { PageElement } from './page'

export default class ForbiddenPage extends Page {
  constructor() {
    super('This service is temporarily unavailable')
  }

  heading = (): PageElement => cy.get('h1')

  bodyText = (): PageElement => cy.get('p.govuk-body')
}
