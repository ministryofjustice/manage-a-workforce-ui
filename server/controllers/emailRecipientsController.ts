import SavedEmail from 'server/models/SavedEmail'
import AllocationsService from '../services/allocationsService'

export default class EmailRecipientsController {
  constructor(private readonly allocationsService: AllocationsService) {}

  public async addEmailRecipient(req, res, crn: string, convictionNumber: string) {
    const { username, token } = res.locals.user
    const { person } = await this.allocationsService.getNotesCache(crn, convictionNumber, username)
    const { email, save } = req.body

    this.allocationsService.setNotesCache(crn, convictionNumber, username, {
      person: [...(person ?? []).filter(p => p.email !== email), { email }],
    })

    if (save) {
      await this.allocationsService.postSavedEmail(username, email, token)
    }

    return res.json()
  }

  public async removeEmailRecipient(req, res, crn: string, convictionNumber: string) {
    const { username, token } = res.locals.user
    const { person } = await this.allocationsService.getNotesCache(crn, convictionNumber, username)
    const { email, saved } = req.body

    if (saved) {
      await this.allocationsService.deleteSavedEmail(username, email, token)
    } else {
      this.allocationsService.setNotesCache(crn, convictionNumber, username, {
        person: [...(person ?? [])].filter(p => p.email !== email),
      })
    }

    return res.json()
  }

  public async getEmailRecipients(req, res, crn: string, convictionNumber: string) {
    const { username, token } = res.locals.user
    const { person } = await this.allocationsService.getNotesCache(crn, convictionNumber, username)

    const savedEmails = await this.allocationsService.getSavedEmails(username, token)

    return res.json({
      recipients: person ?? [],
      saved: savedEmails.map(email => ({
        email,
        checked: (person ?? []).map(p => p.email).includes(email),
      })),
    })
  }
}
