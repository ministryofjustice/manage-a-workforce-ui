import Page from '../pages/page'
import ChoosePractitionerPage from '../pages/choosePractitioner'
import SummaryPage from '../pages/summary'

context('Choose Practitioner', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubUserPreferenceTeams', ['N03F01', 'N03F02'])
    cy.task('stubGetUnallocatedCasesByTeams', {
      teamCodes: 'N03F01,N03F02',
      response: [
        {
          teamCode: 'N03F01',
          caseCount: 4,
        },
        {
          teamCode: 'N03F02',
          caseCount: 6,
        },
      ],
    })
    cy.task('stubWorkloadCases', {
      teamCodes: 'N03F01,N03F02',
      response: [
        {
          teamCode: 'N03F01',
          totalCases: 3,
          workload: 77,
        },
        {
          teamCode: 'N03F02',
          totalCases: 3,
          workload: 77,
        },
      ],
    })
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
    cy.task('stubChoosePractitioners')
  })

  it('notification banner visible on page', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const regionPage = Page.verifyOnPage(ChoosePractitionerPage)
    regionPage
      .notificationBanner()
      .should(
        'contain',
        'If a probation practitioner does not have an email address in NDelius, you cannot allocate cases to them through the Allocations tool.'
      )
  })

  it('notification banner is not visible on page if all practitioner have email addresses', () => {
    cy.task('stubChoosePractitionersWithEmails')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const regionPage = Page.verifyOnPage(ChoosePractitionerPage)
    regionPage.notificationBanner().should('not.exist')
  })

  it('Offender details visible on page', () => {
    cy.task('stubGetCurrentlyManagedCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('navigate to allocate page through case view', () => {
    cy.task('stubGetCurrentlyManagedCaseForChoosePractitioner')
    cy.task('stubGetUnallocatedCase')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/case-view')
    const summaryPage = Page.verifyOnPage(SummaryPage)
    summaryPage.allocateCaseButton('J678910', '1', 'PDU1').click()
    Page.verifyOnPage(ChoosePractitionerPage)
  })

  it('Section break is visible on page', () => {
    cy.task('stubGetCurrentlyManagedCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.sectionBreak().should('exist')
  })

  it('Sub heading is visible on page', () => {
    cy.task('stubGetCurrentlyManagedCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.subHeading().should('contain', 'Allocate to a probation practitioner')
  })

  it('Warning is visible on page if probation status is currently managed', () => {
    cy.task('stubGetCurrentlyManagedCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage
      .warningText()
      .should('contain', 'Dylan Adam Armstrong is currently managed by Derek Pint (PO)')
    choosePractitionerPage.warningIcon().should('exist')
  })

  it('Warning is not visible on page if no offender manager details', () => {
    cy.task('stubGetCurrentlyManagedNoOffenderManagerCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.warningText().should('not.exist')
    choosePractitionerPage.warningIcon().should('not.exist')
  })

  it('Warning is visible on page if no offender manager details for previously managed', () => {
    cy.task('stubGetPreviouslyManagedNoOffenderManagerCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.warningText().should('contain', 'Dylan Adam Armstrong was previously managed.')
    choosePractitionerPage.warningIcon().should('exist')
  })

  it('Warning is visible on page if probation status is Previously managed', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.warningText().should('contain', 'Don Cole was previously managed by Derek Pint (PO)')
    choosePractitionerPage.warningIcon().should('exist')
  })

  it('Warning is not visible on page if probation status is New to probation', () => {
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.warningText().should('not.exist')
    choosePractitionerPage.warningIcon().should('not.exist')
  })

  it('Team tabs visible on page', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tabs().find('.govuk-tabs__tab').should('have.length', 3)
    choosePractitionerPage.tab('all-teams').should('contain', 'All teams')
    choosePractitionerPage.tab('N03F01').should('contain', 'Team 1')
    choosePractitionerPage.tab('N03F02').should('contain', 'Team 2')
  })

  it('All teams visible on page by default', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage
      .tabtable('all-teams')
      .should('not.have.attr', 'class', 'govuk-tabs__panel--hidden')
      .getTable()
      .should('deep.equal', [
        {
          Name: 'Jim Jam',
          Team: 'Team 2',
          Grade: 'POprobation officer',
          'Workload %': '32%',
          'Cases in past 7 days': '5',
          'Community cases': '0',
          'Custody cases': '5',
          Select: '',
        },
        {
          Name: 'Jane Doe',
          Team: 'Team 1',
          Grade: 'PQiPtrainee probation officer',
          'Workload %': '19%',
          'Cases in past 7 days': '2',
          'Community cases': '3',
          'Custody cases': '5',
          Select: '',
        },
        {
          Name: 'Sam Smam',
          Team: 'Team 2',
          Grade: 'SPOsenior probation officer',
          'Workload %': '32%',
          'Cases in past 7 days': '5',
          'Community cases': '0',
          'Custody cases': '5',
          Select: '',
        },
      ])
  })

  it('All teams view link is correct', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tab('N03F02').click()
    choosePractitionerPage
      .officerLink('OM2')
      .should('have.attr', 'href')
      .and('include', '/pdu/PDU1/J678910/convictions/1/allocate/N03F02/OM2/officer-view')
  })

  it('Individual team visible on page when selected', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tab('N03F02').click()
    choosePractitionerPage
      .tabtable('N03F02')
      .getTable()
      .should('deep.equal', [
        {
          Name: 'Jim Jam',
          Team: 'Team 2',
          Grade: 'POprobation officer',
          'Workload %': '32%',
          'Cases in past 7 days': '5',
          'Community cases': '0',
          'Custody cases': '5',
          Select: '',
        },
        {
          Name: 'Sam Smam',
          Team: 'Team 2',
          Grade: 'SPOsenior probation officer',
          'Workload %': '32%',
          'Cases in past 7 days': '5',
          'Community cases': '0',
          'Custody cases': '5',
          Select: '',
        },
      ])
  })

  it('Individual team view link is correct', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tab('N03F02').click()
    choosePractitionerPage
      .officerLink('OM2')
      .should('have.attr', 'href')
      .and('include', '/pdu/PDU1/J678910/convictions/1/allocate/N03F02/OM2/officer-view')
  })

  it('Individual team select radio button contains the correct team', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tab('N03F02').click()
    choosePractitionerPage.tabtable('N03F02').within(() => {
      cy.get('input:first').should('have.value', 'N03F02::OM3')
    })
  })

  it('Breadcrumbs visible on page', () => {
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case details')
  })

  it('should only be able to select one offender manager at a time', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tabtable('all-teams').within(() => {
      choosePractitionerPage.radio('N03F01::OM1').check()
      choosePractitionerPage.checkedRadioButton().should('have.value', 'N03F01::OM1')
      choosePractitionerPage.radio('N03F02::OM3').check()
      choosePractitionerPage.checkedRadioButton().should('have.value', 'N03F02::OM3')
    })
  })

  it('should display error when no offender managers selected and allocate case button clicked', () => {
    cy.task('stubGetNewToProbationCaseForChoosePractitioner')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.allocateCaseButton().click()
    choosePractitionerPage
      .errorSummary()
      .trimTextContent()
      .should('equal', 'There is a problem Select a probation practitioner')
  })

  it('should clear selection when clicking on Clear selection', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tab('N03F02').click()
    choosePractitionerPage.tabtable('N03F02').within(() => {
      choosePractitionerPage.radio('N03F02::OM3').check()
      choosePractitionerPage.checkedRadioButton().should('have.value', 'N03F02::OM3')
    })
    choosePractitionerPage.clearSelectionButton().click()
    choosePractitionerPage.tabtable('N03F02').within(() => {
      choosePractitionerPage.checkedRadioButton().should('not.exist')
    })
  })

  it('should not show selection radio when there is no email', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tabtable('all-teams').within(() => {
      choosePractitionerPage.radio('N03F02::OM2').should('not.exist')
    })
  })
})
