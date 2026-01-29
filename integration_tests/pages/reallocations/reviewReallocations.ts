import Page, { PageElement } from '../page'

export default class ReviewReallocationsPage extends Page {
  constructor() {
    super('Review reallocation')
  }

  heading = (): PageElement => cy.get('h1.govuk-heading-xl')

  caption = (): PageElement => cy.get('.govuk-caption-xl')

  search = (): PageElement => cy.get('#crn-lookup-component')

  case = (): PageElement => cy.get('table[data-persistent-id="reallocation-case"]')

  label = (): PageElement => cy.get('.govuk-label')

  hint = (): PageElement => cy.get('.govuk-hint')

  instructionsTextArea = (): PageElement => cy.get(`#reallocationNotes`)

  subHeading = (): PageElement => cy.get('.govuk-heading-l')
}
