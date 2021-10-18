export default class AuthSignInPage {
  checkOnPage(): void {
    cy.get('h1').contains('Sign in')
  }
}
