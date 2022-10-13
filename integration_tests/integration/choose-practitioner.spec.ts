import Page from '../pages/page'
import ChoosePractitionerPage from '../pages/choose-practitioner'
import SummaryPage from '../pages/summary'

context('Choose Practitioner', () => {
  beforeEach(() => {
    cy.task('reset')
    cy.task('stubSetup')
    cy.task('stubGetTeamDetails', {
      code: 'TM1',
      name: 'Wrexham Team 1',
    })
    cy.task('stubGetAllocateOffenderManagers', 'TM1')
  })

  it('Offender details visible on page', () => {
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('navigate to allocate page through case view', () => {
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.allocateCaseButton('J678910', '123456789', 'TM1').click()
    Page.verifyOnPage(ChoosePractitionerPage)
  })

  it('Section break is visible on page', () => {
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.sectionBreak().should('exist')
  })

  it('Sub heading is visible on page', () => {
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.subHeading().should('contain', 'Allocate to a probation practitioner in Wrexham Team 1')
  })

  it('Warning is visible on page if probation status is currently managed', () => {
    cy.task('stubGetCurrentlyManagedCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage
      .warningText()
      .should('contain', 'Dylan Adam Armstrong is currently managed by Antonio LoSardo (SPO)')
    choosePractitionerPage.warningIcon().should('exist')
  })

  it('Warning is not visible on page if no offender manager details', () => {
    cy.task('stubGetCurrentlyManagedNoOffenderManagerCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.warningText().should('not.exist')
    choosePractitionerPage.warningIcon().should('not.exist')
  })

  it('Warning is visible on page if no offender manager details for previously managed', () => {
    cy.task('stubGetPreviouslyManagedNoOffenderManagerCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.warningText().should('contain', 'Dylan Adam Armstrong was previously managed.')
    choosePractitionerPage.warningIcon().should('exist')
  })

  it('Warning is visible on page if probation status is Previously managed', () => {
    cy.task('stubGetPreviouslyManagedCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage
      .warningText()
      .should('contain', 'Dylan Adam Armstrong was previously managed by Sofia Micheals (PO)')
    choosePractitionerPage.warningIcon().should('exist')
  })

  it('Warning is not visible on page if probation status is New to probation', () => {
    cy.task('stubGetNewToProbationCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.warningText().should('not.exist')
    choosePractitionerPage.warningIcon().should('not.exist')
  })

  it('Officer table visible on page', () => {
    cy.task('stubGetNewToProbationCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage
      .table()
      .getTable()
      .should('deep.equal', [
        {
          Name: 'Ben Doe',
          Grade: 'POProbation Officer',
          'Workload %': '50%',
          'Cases in past 7 days': '0',
          'Community cases': '15',
          'Custody cases': '20',
          'Workload details': 'View',
          Select: '',
        },
        {
          Name: 'John Smith',
          Grade: 'POProbation Officer',
          'Workload %': '10%',
          'Cases in past 7 days': '3',
          'Community cases': '25',
          'Custody cases': '15',
          'Workload details': 'View',
          Select: '',
        },
        {
          Name: 'Sally Smith',
          Grade: 'PSOProbation Service Officer',
          'Workload %': '80%',
          'Cases in past 7 days': '6',
          'Community cases': '25',
          'Custody cases': '28',
          'Workload details': 'View',
          Select: '',
        },
      ])
  })

  it('Breadcrumbs visible on page', () => {
    cy.task('stubGetNewToProbationCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case details')
  })

  it('should only be able to select one offender manager at a time', () => {
    cy.task('stubGetNewToProbationCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.radioButtons().first().check()
    choosePractitionerPage.checkedRadioButton().should('have.value', 'OM1')
    choosePractitionerPage.radioButtons().last().check()
    choosePractitionerPage.checkedRadioButton().should('have.value', 'OM2')
  })

  it('should display error when no offender managers selected and allocate case button clicked', () => {
    cy.task('stubGetNewToProbationCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.allocateCaseButton().click()
    choosePractitionerPage
      .errorSummary()
      .trimTextContent()
      .should('equal', 'There is a problem Select a probation practitioner')
  })

  it('should clear selection when clicking on Clear selection', () => {
    cy.task('stubGetNewToProbationCaseOverview')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/123456789/allocate')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.radioButtons().first().check()
    choosePractitionerPage.checkedRadioButton().should('have.value', 'OM1')
    choosePractitionerPage.clearSelectionButton().click()
    choosePractitionerPage.checkedRadioButton().should('not.exist')
  })
})
