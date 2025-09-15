import express, { Router, Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import crypto from 'crypto'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  router.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString('base64')
    next()
  })

  router.use((req: Request, res: Response, next: NextFunction) => {
    const cspMiddleware = helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'", 'https://www.google-analytics.com', 'www.google-analytics.com'],
          scriptSrc: [
            "'self'",
            'code.jquery.com',
            'www.smartsurvey.co.uk',
            'https://embed.smartsurvey.io',
            'www.googletagmanager.com',
            'www.google-analytics.com',
            'https://www.google-analytics.com',
            'https://www.googletagmanager.com',
            'js.monitor.azure.com',
            "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
            "'sha256-xseXYIyJf+ofw4QIbNxoWnzeuWkO8antz0n3bwjWrMk='",
            `'nonce-${res.locals.cspNonce}'`,
            'https://fonts.googleapis.com',
          ],
          styleSrc: [
            "'self'",
            '*.smartsurvey.co.uk',
            '*.smartsurvey.io',
            `'nonce-${res.locals.cspNonce}'`,
            "'unsafe-hashes'",
            "'sha256-uLscbKA9leLZ+gAcOlaJsUafZAw8nl4mzJuREYz2ZoQ='",
            "'sha256-qnVkQSG7pWu17hBhIw0kCpfEB3XGvt0mNRa6+uM6OUU='",
            "'sha256-guH/S8dbM7pl7LdFpjKvhBzxwiA3zwMQT7j5rhbB+F8='",
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
          ],
          fontSrc: ["'self'", '*.smartsurvey.co.uk', 'https://fonts.gstatic.com'],
          imgSrc: [
            "'self'",
            'https://www.google-analytics.com',
            'www.google-analytics.com',
            '*.analytics.google.com',
            '*.google-analytics.com',
            '*.googletagmanager.com',
            '*.smartsurvey.co.uk',
            '*.smartsurvey.io',
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
            'smartsurvey.io',
            'https://www.smartsurvey.co.uk/t/popup/TX187O',
          ],
        },
      },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      frameguard: { action: 'deny' },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      xssFilter: true,
    })

    cspMiddleware(req, res, next)
  })

  return router
}
