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
    cy.task('stubGetAllocateOffenderManagers')
    cy.signIn()
    cy.visit('/J678910/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Section break is visible on page', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.signIn()
    cy.visit('/J678910/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.sectionBreak().should('exist')
  })

  it('Sub heading is visible on page', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.signIn()
    cy.visit('/J678910/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.subHeading().should('contain', 'Allocate to a probation practitioner in Wrexham')
  })

  it('Warning is visible on page if currently managed', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.signIn()
    cy.visit('/J678910/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.warningText().should('contain', 'Dylan Adam Armstrong is currently managed by Antonio LoSardo (SPO)')
    allocatePage.warningIcon().should('exist')
  })

  it('Warning is not visible on page if no offender manager details', () => {
    cy.task('stubGetAllocateOffenderManagersNoOffenderManager')
    cy.signIn()
    cy.visit('/J678910/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.warningText().should('not.exist')
    allocatePage.warningIcon().should('not.exist')
  })

  it('Warning is not visible on page if probation status is Previously managed', () => {
    cy.task('stubGetAllocateOffenderManagersPreviouslyManaged')
    cy.signIn()
    cy.visit('/J678910/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.warningText().should('not.exist')
    allocatePage.warningIcon().should('not.exist')
  })

  it('Warning is not visible on page if probation status is New to probation', () => {
    cy.task('stubGetAllocateOffenderManagersNewToProbation')
    cy.signIn()
    cy.visit('/J678910/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.warningText().should('not.exist')
    allocatePage.warningIcon().should('not.exist')
  })

  it('Officer table visible on page', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.signIn()
    cy.visit('/J678910/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage
      .table()
      .getTable()
      .should('deep.equal', [
        {
          Name: 'Ben Doe',
          Grade: 'PO',
          Capacity: '50%',
          'Community cases': '15',
          'Custody cases': '20',
          Select: '',
        },
      ])
  })

  it('Breadcrumbs visible on page', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.signIn()
    cy.visit('/J678910/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.breadCrumbs().should('contain', 'Home').and('contain', 'Unallocated cases').and('contain', 'Case view')
  })
})
