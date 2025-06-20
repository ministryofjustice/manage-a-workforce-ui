import Page from '../pages/page'
import ProbationRecordPage from '../pages/probationRecord'
import outOfAreasBannerBlurb from '../constants'

context('Probation record', () => {
  beforeEach(() => {
    cy.task('stubSetup')
    cy.task('stubGetUnallocatedCase')
    cy.task('stubForLaoStatus', { crn: 'J678910', response: 'false' })
    cy.task('stubForCrnAllowedUserRegion', { userId: 'USER1', crn: 'J678910', convictionNumber: '1', errorCode: 200 })
    cy.task('stubForRegionAllowedForUser', { userId: 'USER1', region: 'RG1', errorCode: 200 })
    cy.task('stubForPduAllowedForUser', { userId: 'USER1', pdu: 'PDU1', errorCode: 200 })
    cy.signIn()
  })

  it('Caption text visible on page', () => {
    cy.task('stubGetProbationRecord')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.captionText().should('contain', 'Tier: C1').and('contain', 'CRN: J678910')
  })

  it('Apostrophes are handled correctly', () => {
    cy.task('stubGetProbationApostropheRecord')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.headingText().should('contain', "John O'Reilly")
  })

  it('Probation record header visible on page', () => {
    cy.task('stubGetProbationRecord')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.probationRecordHeading().should('contain', 'Probation record')
    cy.contains(outOfAreasBannerBlurb).should('not.exist')
  })

  it('Out of area transfer banner is visible on page and continue button is disabled when case is out of area transfer case', () => {
    cy.task('stubGetUnallocatedCaseWhereIsOutOfAreaTransfer')
    cy.task('stubGetProbationRecord')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.probationRecordHeading().should('contain', 'Probation record')
    probationRecordPage.outOfAreaBanner().should('contain', outOfAreasBannerBlurb)
    probationRecordPage.button().should('contain', 'Continue')
    probationRecordPage.button().should('be.disabled')
  })

  it('Sub nav visible on page', () => {
    cy.task('stubGetProbationRecord')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage
      .subNav()
      .should('contain', 'Summary')
      .and('contain', 'Probation record')
      .and('contain', 'Risk')
      .and('contain', 'Documents')
  })

  it('Probation record tab is highlighted', () => {
    cy.task('stubGetProbationRecord')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.highlightedTab().should('contain.text', 'Probation record')
  })

  it('navigate to probation record through case summary', () => {
    cy.task('stubAllEstateByRegionCode')
    cy.task('stubUserPreferenceAllocationDemand', { pduCode: 'PDU1', lduCode: 'LDU1', teamCode: 'TM1' })
    cy.task('stubGetAllocationsByTeam', { teamCode: 'TM1' })
    cy.task('stubCaseAllocationHistoryCount', 20)
    cy.task('stubGetProbationRecord')
    cy.get('a[href*="/pdu/PDU1/find-unallocated"]').click()
    cy.get('a[href*="/pdu/PDU1/J678910/convictions/1/case-view"]').click()
    cy.get('a[href*="/pdu/PDU1/J678910/convictions/1/probation-record"]').click()
    Page.verifyOnPage(ProbationRecordPage)
  })

  it('Continue button enabled and visible on page', () => {
    cy.task('stubGetProbationRecord')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.button().should('contain', 'Continue')
    probationRecordPage.button().should('not.be.disabled')
  })

  it('Current sentences sub-heading visible on page with body text', () => {
    cy.task('stubGetProbationRecordNoConvictions')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.subHeading().should('contain', 'Current sentences')
    probationRecordPage.bodyText().should('contain', 'No current sentences.')
  })

  it('Previous sentences sub-heading visible on page with body text', () => {
    cy.task('stubGetProbationRecordNoConvictions')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.subHeading().should('contain', 'Previous sentences')
    probationRecordPage.bodyText().should('contain', 'No previous sentences.')
  })

  it('Current sentences table displayed on page when active convictions exist', () => {
    cy.task('stubGetProbationRecord')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage
      .currentSentencesTable()
      .getTable()
      .should('deep.equal', [
        {
          Sentence: 'ORA Community Order (18 Months)',
          Offence: 'Common assault and battery - 10501',
          'Start date': '5 November 2020',
          'Probation practitioner': 'Unknown',
        },
        {
          Sentence: 'Adult Custody < 12m (6 Months)',
          Offence: 'Abstracting electricity - 04300',
          'Start date': '17 November 2019',
          'Probation practitioner': 'Sheila Linda Hancock (PSO)',
        },
      ])
  })

  it('Current sentences table displays multiple offences as numbered list', () => {
    cy.task('stubGetProbationRecordMultipleOffences')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage
      .currentSentencesTable()
      .getTable()
      .should('deep.equal', [
        {
          Sentence: 'Adult Custody < 12m (6 Months)',
          Offence: 'Abstracting electricity - 04300Common assault and battery - 10501',
          'Start date': '17 November 2019',
          'Probation practitioner': 'Sheila Linda Hancock (PSO)',
        },
      ])
  })

  it('Previous sentences table displays when inactive convictions exist', () => {
    cy.task('stubGetProbationRecord')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage
      .previousSentencesTable()
      .getTable()
      .should('deep.equal', [
        {
          Sentence: 'ORA Community Order (18 Months)',
          Offence: 'Common assault and battery - 10501',
          'End date': '5 November 2020',
          'Probation practitioner': 'Unknown',
        },
        {
          Sentence: 'Fine',
          Offence: 'Abstracting electricity - 04300',
          'End date': '23 June 2018',
          'Probation practitioner': 'Sheila Linda Hancock (PSO)',
        },
      ])
    probationRecordPage.viewAllLink().should('not.exist')
  })

  it('more than 3 previous sentences should display first three orders and view all link', () => {
    cy.task('stubGetManyPreviousProbationRecord')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.previousSentencesTable().getTable().should('have.length', 3)
    probationRecordPage.viewAllLink().should('exist')
  })

  it('more than 3 previous sentences with view all as true should display all sentences and not view all link', () => {
    cy.task('stubGetManyPreviousProbationRecord')
    cy.visit('/pdu/PDU1/J678910/convictions/1/probation-record?viewAll=true')
    const probationRecordPage = Page.verifyOnPage(ProbationRecordPage)
    probationRecordPage.previousSentencesTable().getTable().should('have.length', 100)
    probationRecordPage.viewAllLink().should('not.exist')
  })
})
