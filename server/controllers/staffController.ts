import { Response } from 'express'
import StaffLookupService from '../services/staffLookupService'

export default class StaffController {
  constructor(private readonly staffLookupService: StaffLookupService) {}

  async lookup(_, res: Response, searchString: string): Promise<void> {
    const lookupResponse = await this.staffLookupService.lookup(res.locals.user.token, searchString)
    res.status(200).send(lookupResponse)
  }
}
