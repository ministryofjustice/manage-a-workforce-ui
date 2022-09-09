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
    const unallocatedCasesByTeam = await this.allocationsService.getUnallocatedCasesByTeam(
      res.locals.user.token,
      teamCode
    )
    const teamOverview = await this.probationEstateService.getTeamByCode(res.locals.user.token, teamCode)

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
          value.caseType
        )
    )
    res.render('pages/unallocated-cases-by-team', {
      pduName: 'North Wales',
      teamName: teamOverview.name,
      teamCode,
      unallocatedCases,
      casesLength: unallocatedCasesByTeam.length,
      title: 'Unallocated cases | Manage a workforce',
    })
  }
}
