import Page from '../pages/page'
import AllocateToPractitionerPage from '../pages/allocate-to-practitioner'

context('Allocate Confirmation', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
    cy.task('stubGetPotentialOffenderManagerWorkload')
    cy.task('stubGetCurrentlyManagedCaseOverview')
  })

  it('Offender details visible on page', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Section break is visible on page', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.sectionBreak().should('exist')
  })

  it('Sub heading is visible on page', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.subHeading().should('have.text', "You're allocating this case to probation practitioner John Doe (PO)")
  })

  it('Breadcrumbs visible on page', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case details')
      .and('contain', 'Allocate to probation practitioner')
  })

  it('Continue button visible on page', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.continueButton().should('exist').and('have.text', 'Continue')
  })

  it('Choose different probation practitioner visible on page', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.link().should('exist').and('contain', 'Choose a different probation practitioner')
    allocatePage.link().should('have.attr', 'href').and('include', '/team/TM1/J678910/convictions/123456789/allocate')
  })

  it('Displays current and potential capacity', () => {
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.capacityImpactStatement().should('have.text', 'This will increase their workload from 50.4% to 64.8%.')
  })

  it('Displays current capacity only when same PoP allocated to same PO', () => {
    cy.task('stubGetPotentialOffenderManagerWorkloadOverCapacitySamePoP')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage
      .capacityImpactStatement()
      .should('have.text', 'Their workload will remain at 50.4% as they are already managing this case.')
  })

  it('Display current and potential capacity as red when over capacity', () => {
    cy.task('stubGetPotentialOffenderManagerWorkloadOverCapacity')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate/OM1/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.redCapacities().should('have.text', '100.2%108.6%')
  })
})
