import express, { Router, Response, NextFunction } from 'express'
import helmet, { noSniff } from 'helmet'
import crypto from 'crypto'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  router.use((_, res: Response, next: NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('base64')
    next()
  })

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  router.use(
    helmet({
      noSniff: false,
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      referrerPolicy: {
        policy: 'unsafe-url',
      },
    })
  )
  return router
}
