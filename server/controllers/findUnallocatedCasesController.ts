import { Request, Response } from 'express'
import type { FindUnallocatedCasesForm } from 'forms'
import ProbationEstateService from '../services/probationEstateService'
import validate from '../validation/validation'
import trimForm from '../utils/trim'

export default class FindUnallocatedCasesController {
  constructor(private readonly probationEstateService: ProbationEstateService) {}

  async findUnallocatedCases(req: Request, res: Response, pduCode: string): Promise<void> {
    const { token } = res.locals.user
    const pduDetails = await this.probationEstateService.getProbationDeliveryUnitDetails(token, pduCode)
    res.render('pages/find-unallocated-cases', {
      pduDetails,
      title: 'Unallocated cases | Manage a workforce',
      errors: req.flash('errors') || [],
    })
  }

  async submitFindUnallocatedCases(req: Request, res: Response, pduCode: string, form): Promise<void> {
    const findUnallocatedCasesForm = trimForm<FindUnallocatedCasesForm>(form)
    const errors = validate(
      findUnallocatedCasesForm,
      { pdu: 'required', ldu: 'required', team: 'required' },
      {
        'required.pdu': 'Select a Probation Delivery Unit',
        'required.ldu': 'Select a Local Delivery Unit',
        'required.team': 'Select a team',
      }
    )

    req.flash('errors', errors)
    // eslint-disable-next-line security-node/detect-dangerous-redirects
    res.redirect(`/probationDeliveryUnit/${pduCode}/find-unallocated`)
  }
}
