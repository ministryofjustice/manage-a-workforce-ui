import Page, { PageElement } from './page'

export default class DocumentsPage extends Page {
  constructor() {
    super('Dylan Adam Armstrong')
  }

  documentsHeading = (): PageElement => cy.get('h2.govuk-heading-l')
}