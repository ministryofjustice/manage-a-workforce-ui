import Page from '../pages/page'
import InstructionsConfirmPage from '../pages/instructions-confirm'

context('Instructions Confirmation', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Offender details visible on page', () => {
    cy.task('stubGetStaffById')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/5678/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Section break is visible on page', () => {
    cy.task('stubGetStaffById')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/5678/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.sectionBreak().should('exist')
  })

  it('Breadcrumbs visible on page', () => {
    cy.task('stubGetStaffById')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/5678/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case view')
      .and('contain', 'Allocate to probation practitioner')
  })

  it('Continue button visible on page', () => {
    cy.task('stubGetStaffById')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/5678/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.continueButton('123456789').should('exist').and('have.text', '\n  Continue\n')
  })

  it('Cancel link visible on page', () => {
    cy.task('stubGetStaffById')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/5678/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.cancelLink('J678910', '123456789').should('exist').and('have.text', 'Cancel')
  })

  it('Instructions textArea should be visible on page', () => {
    cy.task('stubGetStaffById')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/5678/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.instructionsTextArea('123456789').should('exist')
    instructionsPage.label().should('contain', 'Review allocation instructions')
    instructionsPage
      .hint()
      .should('contain', 'Review the notes you have made before sending to the probation practitioner.')
  })

  it('Inset text should be visible on page', () => {
    cy.task('stubGetStaffById')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/5678/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage
      .insetText()
      .should('contain', 'These notes will automatically be sent to John Doe (john.doe@test.justice.gov.uk)')
  })
})
