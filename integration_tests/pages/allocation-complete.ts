import Page, { PageElement } from './page'

export default class AllocationConfirmPage extends Page {
  constructor() {
    super('J678910')
  }

  notificationsBadge = (): PageElement => cy.get('.moj-notification-badge')
}
