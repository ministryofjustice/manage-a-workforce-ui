import express, { Router } from 'express'
import helmet from 'helmet'

export default function setUpWebSecurity(): Router {
  const router = express.Router()

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  router.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          // Hash allows inline script pulled in from https://github.com/alphagov/govuk-frontend/blob/master/src/govuk/template.njk
          scriptSrc: [
            "'self'",
            "'code.jquery.com'",
            "'sha256-+6WnXIl4mbFTCARd8N3COQmT3bJJmo32N8q8ZSQAIcU='",
            "'sha256-xseXYIyJf+ofw4QIbNxoWnzeuWkO8antz0n3bwjWrMk='",
          ],
          styleSrc: [
            "'self'",
            "'code.jquery.com'",
            "'sha256-AKswrMHyjd0GSwoPT81/UUJaaYc9Y1jTorRYps5GsQc='",
            "'sha256-xVy/81YzzTdGdMAj/TciAlD2J5UTOVLOsxo8RFclhQ4='",
          ],
          fontSrc: ["'self'"],
        },
      },
      referrerPolicy: {
        policy: 'strict-origin-when-cross-origin',
      },
    })
  )
  return router
}
