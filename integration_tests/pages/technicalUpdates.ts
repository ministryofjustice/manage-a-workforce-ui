import Page, { PageElement } from './page'

export default class TechnicalUpdatesPage extends Page {
  constructor() {
    super('New features')
  }

  sendFeedback = (): PageElement => cy.get('[data-qa-link="send-feedback"]')
}
