import express, { Router } from 'express'

export default function setUpHealthChecks(): Router {
  const router = express.Router()

  router.get('/health', (_, res) => {
    res.send({
      healthy: true,
    })
  })

  router.get('/ping', (_, res) =>
    res.send({
      status: 'UP',
    })
  )

  return router
}
