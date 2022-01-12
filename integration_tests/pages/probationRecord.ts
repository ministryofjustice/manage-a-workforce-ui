import Page, { PageElement } from './page'

export default class ProbationRecordPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  probationRecordHeading = (): PageElement => cy.get('h2.govuk-heading-l')
}
