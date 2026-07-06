import e from 'express'

import EmailRecipientsController from '../controllers/emailRecipientsController'
import type { Services } from '../services'

export default function emailRecipientsRoutes(
  services: Services,
  get: (path: string, handler: e.RequestHandler) => e.Router,
  post: (path: string, handler: e.RequestHandler) => e.Router,
): void {
  const emailRecipientsController = new EmailRecipientsController(services.allocationsService)

  post('/email-recipients/:crn/:convictionNumber', async (req, res) => {
    const { crn, convictionNumber } = req.params
    const response = await emailRecipientsController.addEmailRecipient(req, res, crn, convictionNumber)
    return response
  })

  post('/email-recipients/:crn/:convictionNumber/remove', async (req, res) => {
    const { crn, convictionNumber } = req.params
    const response = await emailRecipientsController.removeEmailRecipient(req, res, crn, convictionNumber)
    return response
  })

  get('/email-recipients/:crn/:convictionNumber', async (req, res) => {
    const { crn, convictionNumber } = req.params
    const response = await emailRecipientsController.getEmailRecipients(req, res, crn, convictionNumber)
    return response
  })
}
