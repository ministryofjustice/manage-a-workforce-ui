import Page from '../pages/page'
import AllocationConfirmPage from '../pages/allocation-confirm'

context('Allocate', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Offender details visible on page', () => {
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.signIn()
    cy.visit('/J678910/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Section break is visible on page', () => {
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.signIn()
    cy.visit('/J678910/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage.sectionBreak().should('exist')
  })

  it('Sub heading is visible on page', () => {
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.signIn()
    cy.visit('/J678910/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage
      .subHeading()
      .should('have.text', 'You are allocating probation practitioner John Doe (PO) to this case.')
  })

  it('Breadcrumbs visible on page', () => {
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.signIn()
    cy.visit('/J678910/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case view')
      .and('contain', 'Allocate to probation practitioner')
  })

  it('Continue button visible on page', () => {
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.signIn()
    cy.visit('/J678910/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage.continueButton().should('exist').and('have.text', 'Continue')
  })

  it('Choose different probation practitioner visible on page', () => {
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.signIn()
    cy.visit('/J678910/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage
      .chooseDifferentProbationPractitionerLink('J678910')
      .should('exist')
      .and('have.text', 'Choose a different probation practitioner')
  })

  it('Displays current and potential capacity', () => {
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.signIn()
    cy.visit('/J678910/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage
      .capacityImpactStatement()
      .should('have.text', 'This will change their workload capacity from 50.4% to 64.8%.')
  })

  it('Display current and potential capacity as red when over capacity', () => {
    cy.task('stubGetPotentialOffenderManagerWorkloadOverCapacity')
    cy.signIn()
    cy.visit('/J678910/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage.redCapacities().should('have.text', '100.2%108.6%')
  })
})
