import Page, { PageElement } from './page'

export default class ChooseEmailRecipientsPage extends Page {
  constructor() {
    super('Choose email recipients ')
  }

  savedEmailsList = (): PageElement => cy.get('#govuk-saved-emails-list li')

  autocomplete = (): PageElement => cy.get('#autocomplete')

  autocompleteList = (): PageElement => cy.get('#autocomplete__listbox li')

  addRecipientBtn = (): PageElement => cy.get('#add-recipient')

  recipientList = (): PageElement => cy.get('#govuk-recipient-list')

  errors = (): PageElement => cy.get('.govuk-error-message')
}
