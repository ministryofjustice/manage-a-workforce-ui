import Page from '../pages/page'
import ChoosePractitionerPage from '../pages/choosePractitioner'
import SummaryPage from '../pages/summary'

context('Choose Practitioner', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetTeamDetails', {
      code: 'TM1',
      name: 'Wrexham Team 1',
    })
    cy.task('stubGetAllocateOffenderManagers', 'TM1')
    // TODO - Can we change all this so it works? ATM we cannot change teams as somethin is hard-coded to use TM1
    cy.task('stubUserPreferenceTeams', ['TM1'])
    cy.task('stubChoosePractitioners', ['TM1'])
    cy.task('stubGetTeamsByCodes', {
      codes: 'N03F01,N03F02',
      response: [
        {
          code: 'N03F01',
          name: 'Team 1',
        },
        {
          code: 'N03F02',
          name: 'Team 2',
        },
      ],
    })
  })

  it('notification banner visible on page', () => {
    cy.task('stubGetCurrentlyManagedCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const regionPage = Page.verifyOnPage(ChoosePractitionerPage)
    regionPage
      .notificationBanner()
      .should(
        'contain',
        'If a probation practitioner does not have an email address in NDelius, you cannot allocate cases to them through the Allocations tool.'
      )
  })

  it('notification banner is not visible on page if all practitioner have email addresses', () => {
    cy.task('stubGetCurrentlyManagedCaseForChoosePractitioner')
    cy.task('stubGetAllocateOffenderManagersWithEmails')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const regionPage = Page.verifyOnPage(ChoosePractitionerPage)
    regionPage.notificationBanner().should('not.exist')
  })

  it('Offender details visible on page', () => {
    cy.task('stubGetCurrentlyManagedCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('navigate to allocate page through case view', () => {
    cy.task('stubGetCurrentlyManagedCaseForChoosePractitioner')
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.allocateCaseButton('J678910', '1', 'TM1').click()
    Page.verifyOnPage(ChoosePractitionerPage)
  })

  it('Section break is visible on page', () => {
    cy.task('stubGetCurrentlyManagedCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.sectionBreak().should('exist')
  })

  it('Sub heading is visible on page', () => {
    cy.task('stubGetCurrentlyManagedCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.subHeading().should('contain', 'Allocate to a probation practitioner in Wrexham Team 1')
  })

  it('Warning is visible on page if probation status is currently managed', () => {
    cy.task('stubGetCurrentlyManagedCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage
      .warningText()
      .should('contain', 'Dylan Adam Armstrong is currently managed by Antonio LoSardo (SPO)')
    choosePractitionerPage.warningIcon().should('exist')
  })

  it('Warning is not visible on page if no offender manager details', () => {
    cy.task('stubGetCurrentlyManagedNoOffenderManagerCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.warningText().should('not.exist')
    choosePractitionerPage.warningIcon().should('not.exist')
  })

  it('Warning is visible on page if no offender manager details for previously managed', () => {
    cy.task('stubGetPreviouslyManagedNoOffenderManagerCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.warningText().should('contain', 'Dylan Adam Armstrong was previously managed.')
    choosePractitionerPage.warningIcon().should('exist')
  })

  it('Warning is visible on page if probation status is Previously managed', () => {
    cy.task('stubGetPreviouslyManagedCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage
      .warningText()
      .should('contain', 'Dylan Adam Armstrong was previously managed by Sofia Micheals (PO)')
    choosePractitionerPage.warningIcon().should('exist')
  })

  it('Warning is not visible on page if probation status is New to probation', () => {
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.warningText().should('not.exist')
    choosePractitionerPage.warningIcon().should('not.exist')
  })

  it('Team tabs visible on page', () => {
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner?doTabs=true')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tabs().find('.govuk-tabs__tab').should('have.length', 3)
    choosePractitionerPage.tab('allteams').should('contain', 'All teams')
    choosePractitionerPage.tab('N03F01').should('contain', 'Team 1')
    choosePractitionerPage.tab('N03F02').should('contain', 'Team 2')
  })

  it('All teams visible on page by default', () => {
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner?doTabs=true')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage
      .tabtable('allteams')
      .should('not.have.attr', 'class', 'govuk-tabs__panel--hidden')
      .getTable()
      .should('deep.equal', [
        {
          Name: 'Jane Doe',
          Team: 'Team 1',
          Grade: 'POUnknown',
          'Workload %': '0%',
          'Cases in past 7 days': '0',
          'Community cases': '0',
          'Custody cases': '0',
          'Workload details': 'View',
          Select: '',
        },
        {
          Name: 'Sam Smam',
          Team: 'Team 2',
          Grade: 'SPOUnknown',
          'Workload %': '0%',
          'Cases in past 7 days': '0',
          'Community cases': '0',
          'Custody cases': '0',
          'Workload details': 'View',
          Select: '',
        },
        {
          Name: 'Jim Jam',
          Team: 'Team 2',
          Grade: 'POUnknown',
          'Workload %': '0%',
          'Cases in past 7 days': '0',
          'Community cases': '0',
          'Custody cases': '0',
          'Workload details': 'View',
          Select: '',
        },
      ])
  })

  it('Individual team visible on page when selected', () => {
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner?doTabs=true')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tab('N03F01').click()
    choosePractitionerPage
      .tabtable('N03F01')
      .getTable()
      .should('deep.equal', [
        {
          Name: 'Jane Doe',
          Grade: 'POUnknown',
          'Workload %': '0%',
          'Cases in past 7 days': '0',
          'Community cases': '0',
          'Custody cases': '0',
          'Workload details': 'View',
          Select: '',
        },
      ])
  })

  it('Officer table visible on page', () => {
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage
      .table()
      .getTable()
      .should('deep.equal', [
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
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case details')
  })

  it('should only be able to select one offender manager at a time', () => {
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.radio('OM3').check()
    choosePractitionerPage.checkedRadioButton().should('have.value', 'OM3')
    choosePractitionerPage.radio('OM2').check()
    choosePractitionerPage.checkedRadioButton().should('have.value', 'OM2')
  })

  it('should display error when no offender managers selected and allocate case button clicked', () => {
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.allocateCaseButton().click()
    choosePractitionerPage
      .errorSummary()
      .trimTextContent()
      .should('equal', 'There is a problem Select a probation practitioner')
  })

  it('should clear selection when clicking on Clear selection', () => {
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.radio('OM3').check()
    choosePractitionerPage.checkedRadioButton().should('have.value', 'OM3')
    choosePractitionerPage.clearSelectionButton().click()
    choosePractitionerPage.checkedRadioButton().should('not.exist')
  })

  it('should not show selection radio when there is no email', () => {
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/team/TM1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.radio('OM1').should('not.exist')
  })
})
