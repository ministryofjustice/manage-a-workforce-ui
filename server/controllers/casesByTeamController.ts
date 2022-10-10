import { Request, Response } from 'express'
import AllocationsService from '../services/allocationsService'
import ProbationEstateService from '../services/probationEstateService'
import UnallocatedCase from './data/UnallocatedCase'

export default class CasesByTeamController {
  constructor(
    private readonly allocationsService: AllocationsService,
    private readonly probationEstateService: ProbationEstateService
  ) {}

  async getAllocationsByTeam(req: Request, res: Response, teamCode: string): Promise<void> {
    const { token } = res.locals.user
    const unallocatedCasesByTeam = await this.allocationsService.getUnallocatedCasesByTeam(token, teamCode)
    const teamOverview = await this.probationEstateService.getTeamByCode(token, teamCode)
    // TODO: get pdu name and code from user preferences
    const unallocatedCases = unallocatedCasesByTeam.map(
      value =>
        new UnallocatedCase(
          value.name,
          value.crn,
          value.tier,
          value.sentenceDate,
          value.initialAppointment,
          value.status,
          value.previousConvictionEndDate,
          value.offenderManager,
          value.convictionId,
          value.caseType,
          value.sentenceLength
        )
    )
    res.render('pages/unallocated-cases-by-team', {
      pduCode: 'WPTNWS',
      pduName: 'North Wales',
      teamName: teamOverview.name,
      teamCode,
      unallocatedCases,
      casesLength: unallocatedCasesByTeam.length,
      title: 'Unallocated cases | Manage a workforce',
    })
  }
}
