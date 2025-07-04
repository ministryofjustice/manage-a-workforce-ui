import { RequestHandler } from 'express'
import { context, trace } from '@opentelemetry/api'

export default function otelMiddleware(): RequestHandler {
  return (req, res, next) => {
    res.on('finish', () => {
      const span = trace.getSpan(context.active())
      if (span && req.route?.path) {
        span.updateName(`${req.method} ${req.route.path}`)
        span.setAttribute('custom.operationName', `${req.method} ${req.route.path}`)
      }
    })
    next()
  }
}
