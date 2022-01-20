import Page, { PageElement } from './page'

export default class NotFoundPage extends Page {
  constructor() {
    super('Page not found')
  }

  bodyText = (): PageElement => cy.get('p.govuk-body')

  link = (): PageElement => cy.get('a.govuk-link')
}
