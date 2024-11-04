import Page from '../pages/page'
import AllocateToPractitionerPage from '../pages/allocateToPractitioner'
import ChoosePractitionerPage from '../pages/choosePractitioner'

context('Allocate to Practitioner', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetPotentialOffenderManagerWorkload', {})
    cy.task('stubForLaoStatus', { crn: 'J678910', response: 'false' })
  })

  it('can navigate to Allocate to Practitioner page from Choose Practitioner', () => {
    cy.task('stubGetTeamDetails', {
      code: 'TM1',
      name: 'Wrexham Team 1',
    })
    cy.task('stubGetTeamsByCodes', {
      code: 'TM1',
      response: [
        {
          code: 'TM1',
          name: 'Team 1',
        },
      ],
    })
    cy.task('stubChoosePractitioners', {
      teamCodes: ['TM1'],
      crn: 'J678910',
      teams: {
        TM1: [
          {
            code: 'OM3',
            name: {
              forename: 'Jane',
              middleName: '',
              surname: 'Doe',
            },
            email: 'j.doe@email.co.uk',
            grade: 'PO',
            workload: 19,
            casesPastWeek: 2,
            communityCases: 3,
            custodyCases: 5,
          },
        ],
      },
    })
    cy.task('stubGetPotentialOffenderManagerWorkload', { teamCode: 'TM1', staffCode: 'OM3' })

    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/choose-practitioner')
    const choosePractitionerPage = Page.verifyOnPage(ChoosePractitionerPage)
    choosePractitionerPage.tabtable('all-teams').within(() => {
      choosePractitionerPage.radio('TM1::OM3').click()
    })
    choosePractitionerPage.allocateCaseButton().click()
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.headingText().should('contain', "You're allocating Dylan Adam Armstrong (C1) to John Doe (PO)")
    allocatePage.breadCrumbsSection().within(() => {
      cy.get('li>a').first().should('have.attr', 'href').and('include', 'PDU1')
    })
  })

  it('Section break is visible on page', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM2/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.sectionBreak().should('exist')
  })

  it('Sub heading is visible on page', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM2/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.headingText().should('contain', "You're allocating Dylan Adam Armstrong (C1) to John Doe (PO)")
  })

  it('Breadcrumbs visible on page', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM2/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage
      .breadCrumbs()
      .should('contain', 'Home')
      .and('contain', 'Unallocated cases')
      .and('contain', 'Case details')
      .and('contain', 'Choose practitioner')
  })

  it('Continue button visible on page', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM2/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.button().should('exist').and('contain', 'Continue')
  })

  it('Continue button links to Decision Evidencing', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM2/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage
      .button()
      .should('have.attr', 'href')
      .and('include', '/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM2/allocation-notes')
  })

  it('Choose different probation practitioner visible on page', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM2/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.link().should('exist').and('contain', 'Choose a different probation practitioner')
    allocatePage
      .link()
      .should('have.attr', 'href')
      .and('include', '/pdu/PDU1/J678910/convictions/1/choose-practitioner')
  })

  it('Displays current and potential capacity', () => {
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM2/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.capacityImpactStatement().should('have.text', 'This will increase their workload from 50.4% to 64.8%.')
  })

  it('Displays current capacity only when same PoP allocated to same PO', () => {
    cy.task('stubGetPotentialOffenderManagerWorkloadOverCapacitySamePoP')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM2/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage
      .capacityImpactStatement()
      .should('have.text', 'Their workload will remain at 50.4% as they are already managing this case.')
  })

  it('Display current and potential capacity as red when over capacity', () => {
    cy.task('stubGetPotentialOffenderManagerWorkloadOverCapacity')
    cy.signIn()
    cy.visit('/pdu/PDU1/J678910/convictions/1/allocate/TM2/OM2/allocate-to-practitioner')
    const allocatePage = Page.verifyOnPage(AllocateToPractitionerPage)
    allocatePage.redCapacities().should('have.text', '100.2%108.6%')
  })
})
