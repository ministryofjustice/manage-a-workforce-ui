import Page, { PageElement } from './page'

export default class TechnicalUpdatesPage extends Page {
  constructor() {
    super('Technical updates')
  }

  sendFeedback = (): PageElement => cy.get('[data-qa-link="send-feedback"]')
}
