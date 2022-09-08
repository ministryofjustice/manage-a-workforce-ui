import Page from '../pages/page'
import AllocatePage from '../pages/allocate'
import SummaryPage from '../pages/summary'

context('Allocate', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
  })

  it('Offender details visible on page', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('navigate to allocate page through case view', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.allocateCaseButton('J678910', '123456789').click()
    Page.verifyOnPage(AllocatePage)
  })

  it('Section break is visible on page', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.sectionBreak().should('exist')
  })

  it('Sub heading is visible on page', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.subHeading().should('contain', 'Allocate to a probation practitioner in Wrexham')
  })

  it('Warning is visible on page if probation status is currently managed', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.warningText().should('contain', 'Dylan Adam Armstrong is currently managed by Antonio LoSardo (SPO)')
    allocatePage.warningIcon().should('exist')
  })

  it('Warning is not visible on page if no offender manager details', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetCurrentlyManagedNoOffenderManagerCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.warningText().should('not.exist')
    allocatePage.warningIcon().should('not.exist')
  })

  it('Warning is visible on page if probation status is Previously managed', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetPreviouslyManagedCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage
      .warningText()
      .should('contain', 'Dylan Adam Armstrong has been previously managed by Sofia Micheals (PO)')
    allocatePage.warningIcon().should('exist')
  })

  it('Warning is not visible on page if probation status is New to probation', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetNewToProbationCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.warningText().should('not.exist')
    allocatePage.warningIcon().should('not.exist')
  })

  it('Officer table visible on page', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetNewToProbationCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage
      .table()
      .getTable()
      .should('deep.equal', [
        {
          Name: 'Ben Doe',
          Grade: 'POProbation Officer',
          Capacity: '50%',
          'Cases in past 7 days': '0',
          'Community cases': '15',
          'Custody cases': '20',
          'Workload details': 'View',
          Select: '',
        },
        {
          Name: 'John Smith',
          Grade: 'POProbation Officer',
          Capacity: '10%',
          'Cases in past 7 days': '3',
          'Community cases': '25',
          'Custody cases': '15',
          'Workload details': 'View',
          Select: '',
        },
        {
          Name: 'Sally Smith',
          Grade: 'PSOProbation Service Officer',
          Capacity: '80%',
          'Cases in past 7 days': '6',
          'Community cases': '25',
          'Custody cases': '28',
          'Workload details': 'View',
          Select: '',
        },
      ])
  })

  it('Breadcrumbs visible on page', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetNewToProbationCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case details')
  })

  it('should only be able to select one offender manager at a time', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetNewToProbationCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.radioButtons().first().check()
    allocatePage.checkedRadioButton().should('have.value', 'OM1')
    allocatePage.radioButtons().last().check()
    allocatePage.checkedRadioButton().should('have.value', 'OM2')
  })

  it('should display error when no offender managers selected and allocate case button clicked', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetNewToProbationCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.allocateCaseButton().click()
    allocatePage.errorSummary().trimTextContent().should('equal', 'There is a problem Select a probation practitioner')
  })

  it('should clear selection when clicking on Clear selection', () => {
    cy.task('stubGetAllocateOffenderManagers')
    cy.task('stubGetNewToProbationCaseOverview')
    cy.signIn()
    cy.visit('/J678910/convictions/123456789/allocate')
    const allocatePage = Page.verifyOnPage(AllocatePage)
    allocatePage.radioButtons().first().check()
    allocatePage.checkedRadioButton().should('have.value', 'OM1')
    allocatePage.clearSelectionButton().click()
    allocatePage.checkedRadioButton().should('not.exist')
  })
})
