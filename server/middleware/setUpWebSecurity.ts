import express, { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import crypto from 'crypto'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  // Step 1: Generate nonce and store it in res.locals
  router.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('base64')
    next()
  })

  // Step 2: Apply CSP using the generated nonce
  router.use((req: Request, res: Response, next: NextFunction) => {
    const cspMiddleware = helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'https://www.google-analytics.com', 'www.google-analytics.com'],
        scriptSrc: [
          "'self'",
          'code.jquery.com',
          'www.smartsurvey.co.uk',
          'www.googletagmanager.com',
          'www.google-analytics.com',
          'https://www.google-analytics.com',
          'https://www.googletagmanager.com',
          'js.monitor.azure.com',
          "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
          "'sha256-xseXYIyJf+ofw4QIbNxoWnzeuWkO8antz0n3bwjWrMk='",
          `'nonce-${res.locals.cspNonce}'`, // ✅ nonce correctly used
        ],
        styleSrc: ["'self'", '*.smartsurvey.co.uk', "'unsafe-inline'"],
        fontSrc: ["'self'", '*.smartsurvey.co.uk'],
        imgSrc: [
          "'self'",
          'https://www.google-analytics.com',
          'www.google-analytics.com',
          '*.analytics.google.com',
          '*.google-analytics.com',
          '*.googletagmanager.com',
          '*.smartsurvey.co.uk',
        ],
        connectSrc: [
          "'self'",
          'www.googletagmanager.com',
          'www.google-analytics.com',
          'https://www.google-analytics.com',
          '*.analytics.google.com',
          '*.google-analytics.com',
          'js.monitor.azure.com',
          'dc.services.visualstudio.com',
          'smartsurvey.co.uk',
        ],
      },
    })

    cspMiddleware(req, res, next) // ✅ correctly call the generated middleware
  })

  return router
}
