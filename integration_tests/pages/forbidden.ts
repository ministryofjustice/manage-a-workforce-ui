import Page, { PageElement } from './page'

export default class ForbiddenPage extends Page {
  constructor() {
    super('No Access')
  }

  message = (): PageElement => cy.get('#forbidden-message')

  heading = (): PageElement => cy.get('#forbidden-header')
}
