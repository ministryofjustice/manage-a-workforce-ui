import Page, { PageElement } from './page'

export default class ActiveCasesPage extends Page {
  constructor() {
    super('Active cases')
  }

  secondaryText = (): PageElement => cy.get('.maw-secondary-text-col')

  heading = (): PageElement => cy.get('caption.govuk-heading-l')
}
