import AuthSignInPage from '../pages/authSignIn'

context('Unallocated', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
  })

  it('Unauthenticated user directed to auth', () => {
    cy.visit('/')
    const authPage = new AuthSignInPage()
    authPage.checkOnPage()
  })

  it('redirects to Wrexham team 1', () => {
    cy.signIn()
    cy.url().should('include', '/team/N03F01/cases/unallocated')
  })
})
