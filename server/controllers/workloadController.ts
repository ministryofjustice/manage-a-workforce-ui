import { Request, Response } from 'express'

import WorkloadService from '../services/workloadService'

export default class WorkloadController {
  constructor(private readonly workloadService: WorkloadService) {}

  async allocationComplete(req: Request, res: Response, crn, convictionNumber, pduCode): Promise<void> {
    const response = await this.workloadService.getAllocationCompleteDetails(
      res.locals.user.token,
      crn,
      convictionNumber
    )

    const { otherEmails, sendEmailCopyToAllocatingOfficer } = req.session.allocationForm
    delete req.session.allocationForm

    return res.render('pages/allocation-complete', {
      title: `${response.name.combinedName} | Case allocated | Manage a workforce`,
      data: response,
      crn,
      convictionNumber,
      otherEmails,
      pduCode,
      sendEmailCopyToAllocatingOfficer,
    })
  }
}
