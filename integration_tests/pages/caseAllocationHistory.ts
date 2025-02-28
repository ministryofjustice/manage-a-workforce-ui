import Page, { PageElement } from './page'

export default class CaseAllocationHistoryPage extends Page {
  constructor() {
    super('Cases allocated in last 7 days')
  }

  region = (): PageElement => cy.get('.govuk-caption-xl')

  probationDeliveryUnit = (): PageElement => cy.get('.govuk-heading-xl')

  subNavLink = (): PageElement => cy.get('a.moj-sub-navigation__link')

  manageMyTeamsLink = (): PageElement => cy.get('[data-qa-link="select-teams"]').invoke('attr', 'href')

  noCaseParagraph = (): PageElement => cy.get('p.govuk-\\!-margin-bottom-9')

  tableCaption = (): PageElement => cy.get('caption.govuk-table__caption')

  otherCasesHeading = (): PageElement => cy.get('h2.govuk-heading-l')

  secondaryText = (): PageElement => cy.get('.maw-secondary')

  warningIcon = (): PageElement => cy.get('.govuk-warning-text__icon')

  warningText = (): PageElement => cy.get('.govuk-warning-text__text')

  tierSortButton = (): PageElement => cy.get('button[data-index="1"]')

  tableLink = (crn: string, convictionNumber: string): PageElement =>
    cy.get(`[data-qa-link="${crn}-${convictionNumber}"]`).invoke('attr', 'href')

  largeHeading = (): PageElement => cy.get('.govuk-heading-l')

  largeHeadingSecondaryText = (): PageElement => cy.get('.secondary-text-col')

  noCasesBody = (): PageElement => cy.get('.govuk-body-l')

  unallocatedCasesSubNavLink = (): PageElement => cy.get('a.moj-sub-navigation__link').contains('Unallocated cases')

  restrictedBadge = (): PageElement => cy.get('.govuk-tag--orange')
}
