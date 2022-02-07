import Page, { PageElement } from './page'

export default class AllocatePage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  sectionBreak = (): PageElement => cy.get('.govuk-section-break')

  subHeading = (): PageElement => cy.get('.govuk-heading-l')

  warningText = (): PageElement => cy.get('.govuk-warning-text')

  warningIcon = (): PageElement => cy.get('.govuk-warning-text__icon')

  tableHeader = (): PageElement => cy.get('.govuk-table__header')
}
