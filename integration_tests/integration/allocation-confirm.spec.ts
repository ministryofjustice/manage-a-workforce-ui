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
})
