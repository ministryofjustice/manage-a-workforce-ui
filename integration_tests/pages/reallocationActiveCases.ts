import Page, { PageElement } from './page'

export default class ActiveCasesPage extends Page {
  constructor() {
    super('Active cases')
  }

  backLink = (): PageElement => cy.get('.govuk-back-link')

  secondaryText = (): PageElement => cy.get('.maw-secondary-text-col')

  caseTableRows = (): PageElement => cy.get('.govuk-table tbody tr').eq(1)

  heading = (): PageElement => cy.get('caption.govuk-heading-l')
}
