import Page, { PageElement } from './page'

export default class UnallocatedPage extends Page {
  constructor() {
    super('South Tyneside')
  }

  probationDeliveryUnit = (): PageElement => cy.get('.govuk-caption-xl')

  primaryNav = (): PageElement => cy.get('ul.moj-primary-navigation__list').children()
}
