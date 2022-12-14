export type PageElement = Cypress.Chainable<JQuery>

export default abstract class Page {
  static verifyOnPage<T>(constructor: new () => T): T {
    return new constructor()
  }

  constructor(private readonly title: string) {
    this.checkOnPage()
    this.checkBetaOnPage()
  }

  checkOnPage(): void {
    cy.get('title').contains(this.title)
  }

  headerUserName = (): PageElement => cy.get('a.moj-header__navigation-link')

  checkBetaOnPage(): void {
    cy.get('.govuk-phase-banner .govuk-phase-banner__content__tag').contains('beta')
    cy.get('.govuk-phase-banner .govuk-phase-banner__text').contains(
      'This is a new service – your feedback will help us to improve it.'
    )
  }

  feedbackLink = (): PageElement => cy.get('.feedback')

  signOut = (): PageElement => cy.get("[href='/sign-out']")

  subNav = (): PageElement => cy.get('ul.moj-sub-navigation__list').children()

  subHeading = (): PageElement => cy.get('.govuk-heading-l')

  highlightedTab = (): PageElement => cy.get('a[aria-current*="page"]')

  errorSummary = (): PageElement => cy.get('.govuk-error-summary')

  captionText = (): PageElement => cy.get('.govuk-caption-xl')

  notificationsBadge = (): PageElement => cy.get('.moj-notification-badge')

  notificationBanner = (): PageElement => cy.get('.govuk-notification-banner')

  breadCrumbs = (): PageElement => cy.get('.govuk-breadcrumbs__list-item')

  button = (): PageElement => cy.get('.govuk-button')

  sectionBreak = (): PageElement => cy.get('.govuk-section-break')

  instructionsTextArea = (): PageElement => cy.get(`#instructions`)

  downloadDocumentLink = (crn, documentId, fileName): PageElement =>
    cy.get(`a[href*="/${crn}/documents/${documentId}/${fileName}"]`)
}
