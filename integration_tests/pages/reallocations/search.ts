import Page, { PageElement } from '../page'

export default class ReallocationsSearchPage extends Page {
  constructor() {
    super('Search')
  }

  heading = (): PageElement => cy.get('h1.govuk-heading-xl')

  caption = (): PageElement => cy.get('.govuk-caption-xl')

  search = (): PageElement => cy.get('#crn-lookup-component')

  case = (): PageElement => cy.get('table[data-persistent-id="reallocation-case"]')
}
