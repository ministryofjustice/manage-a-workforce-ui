import {
  setup,
  defaultClient,
  TelemetryClient,
  DistributedTracingModes,
  getCorrelationContext,
} from 'applicationinsights'
import { RequestHandler } from 'express'

import { context, trace } from '@opentelemetry/api'

import applicationVersion from '../applicationVersion'

function defaultName(): string {
  const {
    packageData: { name },
  } = applicationVersion
  return name
}

function version(): string {
  const { buildNumber } = applicationVersion
  return buildNumber
}

export function initialiseAppInsights(): void {
  if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    // eslint-disable-next-line no-console
    console.log('Enabling azure application insights')

    setup().setDistributedTracingMode(DistributedTracingModes.AI_AND_W3C).start()
  }
}

export function buildAppInsightsClient(name: string = defaultName()): TelemetryClient {
  if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    defaultClient.context.tags['ai.cloud.role'] = name
    defaultClient.context.tags['ai.application.ver'] = version()

    defaultClient.addTelemetryProcessor(({ tags, data }, contextObjects) => {
      const operationNameOverride = contextObjects.correlationContext?.customProperties?.getProperty('operationName')
      if (operationNameOverride) {
        tags['ai.operation.name'] = data.baseData.name = operationNameOverride // eslint-disable-line no-param-reassign,no-multi-assign
      }
      return true
    })

    return defaultClient
  }
  return null
}

export function otelMiddleware(): RequestHandler {
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
