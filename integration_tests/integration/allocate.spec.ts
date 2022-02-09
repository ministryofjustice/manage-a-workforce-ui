import Page from '../pages/page'
import AllocatePage from '../pages/allocate'

context('Allocate', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSignIn')
    cy.task('stubAuthUser')
    cy.task('stubGetAllocations')
  })

  it('Offender details visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    cy.get('a[href*="J678910/allocate"]').click()
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Section break is visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    cy.get('a[href*="J678910/allocate"]').click()
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.sectionBreak().should('exist')
  })

  it('Sub heading is visible on page', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    cy.get('a[href*="J678910/allocate"]').click()
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.subHeading().should('contain', 'Allocate to a probation practitioner in Wrexham')
  })

  it('Warning is visible on page if currently managed', () => {
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/J678910/case-view')
    cy.get('a[href*="J678910/allocate"]').click()
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.warningText().should('contain', 'Dylan Adam Armstrong is currently managed by Antonio LoSardo (SPO)')
    allocatePage.warningIcon().should('exist')
  })

  it('Warning is not visible on page if no offender manager details', () => {
    cy.task('stubGetUnallocatedCaseNoOffenderManager')
    cy.signIn()
    cy.visit('/J678910/case-view')
    cy.get('a[href*="J678910/allocate"]').click()
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.warningText().should('not.exist')
    allocatePage.warningIcon().should('not.exist')
  })

  it('Warning is not visible on page if probation status is Previously managed', () => {
    cy.task('stubGetUnallocatedCasePreviouslyManaged')
    cy.signIn()
    cy.visit('/J678910/case-view')
    cy.get('a[href*="J678910/allocate"]').click()
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.warningText().should('not.exist')
    allocatePage.warningIcon().should('not.exist')
  })

  it('Warning is not visible on page if probation status is New to probation', () => {
    cy.task('stubGetUnallocatedCaseNewToProbation')
    cy.signIn()
    cy.visit('/J678910/case-view')
    cy.get('a[href*="J678910/allocate"]').click()
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.warningText().should('not.exist')
    allocatePage.warningIcon().should('not.exist')
  })

  it('Officer table headers visible on page', () => {
    cy.task('stubGetUnallocatedCaseNewToProbation')
    cy.signIn()
    cy.visit('/J678910/case-view')
    cy.get('a[href*="J678910/allocate"]').click()
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage
      .tableHeader()
      .should('contain', 'Name')
      .and('contain', 'Grade')
      .and('contain', 'Capacity')
      .and('contain', 'Community cases')
      .and('contain', 'Custody cases')
      .and('contain', 'Select')
  })

  it('Breadcrumbs visible on page', () => {
    cy.task('stubGetUnallocatedCaseNewToProbation')
    cy.signIn()
    cy.visit('/J678910/case-view')
    cy.get('a[href*="J678910/allocate"]').click()
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.breadCrumbs().should('contain', 'Home').and('contain', 'Unallocated cases').and('contain', 'Case view')
  })
})
