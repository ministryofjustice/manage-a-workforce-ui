import Page, { PageElement } from './page'

export default class CaseAlreadyAllocated extends Page {
  constructor() {
    super('Sally Smith')
  }

  bodyText = (): PageElement => cy.get('h2.govuk-heading-l')

  link = (): PageElement => cy.get('[data-qa-link="return-to-unallocated"]')
}
