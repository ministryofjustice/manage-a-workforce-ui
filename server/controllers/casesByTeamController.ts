import { Request, Response } from 'express'
import Allocation from '../models/Allocation'
import AllocationsService from '../services/allocationsService'
import UnallocatedCase from './data/UnallocatedCase'

export default class CasesByTeamController {
  constructor(private readonly allocationsService: AllocationsService) {}

  async getAllocationsByTeam(req: Request, res: Response, teamCode: string): Promise<void> {
    const response: Allocation[] = await this.allocationsService.getUnallocatedCasesByTeam(
      res.locals.user.token,
      teamCode
    )
    const unallocatedCases = response.map(
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
    const { session } = req
    session.casesLength = response.length
    res.render('pages/unallocated-cases-by-team', {
      pduName: 'North Wales',
      teamName: teamCode,
      unallocatedCases,
      casesLength: response.length,
      title: 'Unallocated cases | Manage a workforce',
    })
  }
}
