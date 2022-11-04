import Page, { PageElement } from './page'

export default class UnallocatedByTeamPage extends Page {
  constructor(teamName: string) {
    super(teamName)
  }

  probationDeliveryUnit = (): PageElement => cy.get('.govuk-caption-xl')

  primaryNav = (): PageElement => cy.get('ul.moj-primary-navigation__list').children()

  navLink = (linkId: string): PageElement => cy.get(`#${linkId}`).invoke('attr', 'href')

  subNavLink = (): PageElement => cy.get('a.moj-sub-navigation__link')

  manageMyTeamsLink = (): PageElement => cy.get('[data-qa-link="select-teams"]').invoke('attr', 'href')

  noCaseParagraph = (): PageElement => cy.get('p.govuk-\\!-margin-bottom-9')

  tableCaption = (): PageElement => cy.get('caption.govuk-table__caption')

  otherCasesHeading = (): PageElement => cy.get('h2.govuk-heading-l')

  secondaryText = (): PageElement => cy.get('.maw-secondary')

  warningIcon = (): PageElement => cy.get('.govuk-warning-text__icon')

  warningText = (): PageElement => cy.get('.govuk-warning-text__text')

  tierSortButton = (): PageElement => cy.get('button[data-index="1"]')

  tableLink = (convictionId: string): PageElement => cy.get(`[data-qa-link="${convictionId}"]`).invoke('attr', 'href')
}
