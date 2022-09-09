import Page from '../pages/page'
import AllocationConfirmPage from '../pages/allocation-confirm'

context('Allocate Confirmation', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.task('stubGetCurrentlyManagedCaseOverview')
  })

  it('Offender details visible on page', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Section break is visible on page', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage.sectionBreak().should('exist')
  })

  it('Sub heading is visible on page', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage.subHeading().should('have.text', 'You’re allocating this case to probation practitioner John Doe (PO)')
  })

  it('Breadcrumbs visible on page', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case details')
      .and('contain', 'Allocate to probation practitioner')
  })

  it('Continue button visible on page', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage.continueButton().should('exist').and('have.text', 'Continue')
  })

  it('Choose different probation practitioner visible on page', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage.link().should('exist').and('contain', 'Choose a different probation practitioner')
    allocatePage.link().should('have.attr', 'href').and('include', '/team/TM1/J678910/convictions/123456789/allocate')
  })

  it('Displays current and potential capacity', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage.capacityImpactStatement().should('have.text', 'This will increase their workload from 50.4% to 64.8%.')
  })

  it('Display current and potential capacity as red when over capacity', () => {
    cy.task('stubGetPotentialOffenderManagerWorkloadOverCapacity')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/confirm')
    const allocatePage = Page.verifyOnPage(AllocationConfirmPage)
    allocatePage.redCapacities().should('have.text', '100.2%108.6%')
  })
})
