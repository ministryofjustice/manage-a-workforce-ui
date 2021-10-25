import Page, { PageElement } from './page'

export default class UnallocatedPage extends Page {
  constructor() {
    super('South Tyneside')
  }

  probationDeliveryUnit = (): PageElement => cy.get('.govuk-caption-xl')

  primaryNav = (): PageElement => cy.get('ul.moj-primary-navigation__list').children()

  subNav = (): PageElement => cy.get('ul.moj-sub-navigation__list').children()

  navLink = (linkId: string): PageElement => cy.get(`#${linkId}`).invoke('attr', 'href')

  subNavLink = (): PageElement => cy.get('a.moj-sub-navigation__link')

  noCaseParagraph = (): PageElement => cy.get('p.govuk-\\!-margin-bottom-9')

  tableHeader = (): PageElement => cy.get('table thead tr').children()

  tableCaption = (): PageElement => cy.get('caption.govuk-table__caption')

  notificationsBadge = (): PageElement => cy.get('.moj-notification-badge')
}
