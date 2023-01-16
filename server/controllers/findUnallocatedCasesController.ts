import { Response } from 'express'
import ProbationEstateService from '../services/probationEstateService'

export default class FindUnallocatedCasesController {
  constructor(private readonly probationEstateService: ProbationEstateService) {}

  async findUnallocatedCases(_, res: Response, pduCode: string): Promise<void> {
    const { token } = res.locals.user
    const pduDetails = await this.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode)
    res.render('pages/find-unallocated-cases', {
      pduDetails,
      title: 'Unallocated cases | Manage a workforce',
    })
  }
}
