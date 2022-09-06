import Page from '../pages/page'
import InstructionsConfirmPage from '../pages/instructions-confirm'

context('Instructions Confirmation', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubUserPreferenceTeams')
    cy.task('stubGetUnallocatedCasesByTeams', {})
    cy.task('stubGetAllocations')
  })

  it('Offender details visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Section break is visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.sectionBreak().should('exist')
  })

  it('Breadcrumbs visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case details')
      .and('contain', 'Allocate to probation practitioner')
  })

  it('Continue button visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.continueButton('123456789').should('exist').and('have.text', '\n  Continue\n')
  })

  it('Cancel link visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.cancelLink('J678910', '123456789').should('exist').and('have.text', 'Cancel')
  })

  it('Instructions textArea should be visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.instructionsTextArea().should('exist')
    instructionsPage.subHeading().should('contain', 'Review allocation instructions')
    instructionsPage
      .label()
      .should('contain', 'These notes will automatically be sent to John Doe (john.doe@test.justice.gov.uk)')
    instructionsPage.hint().should('contain', 'Review your notes for the probation practitioner.')
  })

  it('another copy text should be visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage
      .copyText()
      .should('contain', 'You can send a copy of these notes to another recipient, for example a case admin officer.')
  })

  it('add a recipient should be visible on page', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.addRecipientHeader().should('contain', 'Add a recipient')
  })

  it('adding another person adds more email address inputs', () => {
    cy.task('stubGetStaffByCode')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate/OM1/instructions')
    const instructionsPage = Page.verifyOnPage(InstructionsConfirmPage)
    instructionsPage.inputTexts().should('have.length', 1)
    instructionsPage.addAnotherPersonButton().click()
    instructionsPage.inputTexts().should('have.length', 2)
  })
})
