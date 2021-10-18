import Page, { PageElement } from './page'

export default class UnallocatedPage extends Page {
  constructor() {
    super('South Tyneside')
  }

  probationDeliveryUnit = (): PageElement => cy.get('.govuk-caption-xl')
}
