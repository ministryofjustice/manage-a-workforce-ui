import express, { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
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
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", 'https://www.google-analytics.com', 'www.google-analytics.com'],
          // Hash allows inline script pulled in from https://github.com/alphagov/govuk-frontend/blob/master/src/govuk/template.njk
          scriptSrc: [
            "'self'",
            'code.jquery.com',
            'www.googletagmanager.com',
            'www.google-analytics.com',
            'https://www.google-analytics.com',
            'https://www.googletagmanager.com',
            "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
            "'sha256-xseXYIyJf+ofw4QIbNxoWnzeuWkO8antz0n3bwjWrMk='",
            (_, res: Response) => `'nonce-${res.locals.cspNonce}'`,
          ],
          styleSrc: ["'self'", (_, res: Response) => `'nonce-${res.locals.cspNonce}'`],
          fontSrc: ["'self'"],
          imgSrc: [
            "'self'",
            'https://www.google-analytics.com',
            'www.google-analytics.com',
            '*.analytics.google.com',
            '*.google-analytics.com',
            '*.googletagmanager.com',
          ],
          connectSrc: [
            "'self'",
            'www.googletagmanager.com',
            'www.google-analytics.com',
            'https://www.google-analytics.com',
            '*.analytics.google.com',
            '*.google-analytics.com',
          ],
        },
      },
      crossOriginEmbedderPolicy: true,
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
    })
  )
  return router
}
