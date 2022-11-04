import Page, { PageElement } from './page'

export default class AllocationConfirmPage extends Page {
  constructor() {
    super('Allocation complete')
  }

  returnToUnallocatedLink = (): PageElement => cy.get('.govuk-link--no-visited-state')

  panelBody = (): PageElement => cy.get('.govuk-panel__body')

  panelTitle = (): PageElement => cy.get('.govuk-panel__title')

  mediumHeading = (): PageElement => cy.get('.govuk-heading-m')

  bulletedList = (): PageElement => cy.get('ul.govuk-list--bullet').children()
}
