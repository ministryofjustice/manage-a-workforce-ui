import e, { type RequestHandler } from 'express'

import AllocationsController from '../controllers/allocationsController'
import type { Services } from '../services'

export default function allocationsCaseViewRoutes(
  services: Services,
  get: (path: string, handler: e.RequestHandler) => e.Router,
  post: (path: string, handler: e.RequestHandler) => e.Router,
  allocationsController: AllocationsController,
): void {
  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/case-view', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await allocationsController.getUnallocatedCase(req, res, crn, convictionNumber, pduCode)
  })

  get('/:crn/documents/:documentId/:documentName', async (req, res) => {
    const { crn, documentId, documentName } = req.params
    await allocationsController.getDocument(res, crn, documentId, documentName)
  })

  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/probation-record', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await allocationsController.getProbationRecord(req, res, crn, convictionNumber, pduCode)
  })

  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/risk', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await allocationsController.getRisk(req, res, crn, convictionNumber, pduCode)
  })

  get('/pdu/:pduCode/:crn/convictions/:convictionNumber/documents', async (req, res) => {
    const { crn, convictionNumber, pduCode } = req.params
    await allocationsController.getDocuments(req, res, crn, convictionNumber, pduCode)
  })
}
