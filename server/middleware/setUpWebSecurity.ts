import express, { Router } from 'express'
import helmet from 'helmet'
import crypto from 'crypto'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  router.use((req, res, next) => {
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
            (req, res) => `'nonce-${(res as unknown as Response).locals.cspNonce}'`,
          ],
          styleSrc: ["'self'", (req, res) => `'nonce-${(res as unknown as Response).locals.cspNonce}'`],
          fontSrc: ["'self'"],
          imgSrc: [
            "'self'",
            'https://www.google-analytics.com',
            'www.google-analytics.com',
            '*.analytics.google.com',
            '*.google-analytics.com',
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
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
    })
  )
  return router
}
