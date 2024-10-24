/* eslint-disable no-param-reassign */
import nunjucks from 'nunjucks'
import express from 'express'
import dayjs from 'dayjs'
import * as pathModule from 'path'
import config from '../config'
import { initialiseName } from './utils'
import type { Services } from '../services'

const production = process.env.NODE_ENV === 'production'

type Error = {
  href: string
  text: string
}

export default function nunjucksSetup(app: express.Express, path: pathModule.PlatformPath, services: Services): void {
  app.set('view engine', 'njk')
  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Manage A Workforce Ui'

  // Cachebusting version string
  if (production) {
    // Version only changes on reboot
    app.locals.version = Date.now().toString()
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString()
      return next()
    })
  }

  const njkEnv = nunjucks.configure(
    [
      path.join(__dirname, '../../server/views'),
      'node_modules/govuk-frontend/dist',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: app,
    }
  )

  njkEnv.addFilter('initialiseName', initialiseName)

  njkEnv.addFilter('dateFormat', (date: string) => {
    return dayjs(date).format(config.dateFormat)
  })

  njkEnv.addFilter('timeFormat', (time: string) => {
    return dayjs(time).format('h:mma')
  })

  njkEnv.addFilter('findError', (array: Error[], formFieldId: string) => {
    const item = array.find(error => error.href === `#${formFieldId}`)
    if (item) {
      return {
        text: item.text,
      }
    }
    return null
  })

  njkEnv.addFilter('getCaseCount', (cases: number) => {
    return cases > 99 ? '99+' : `${cases}`
  })

  njkEnv.addGlobal('workloadMeasurementUrl', config.nav.workloadMeasurement.url)
  njkEnv.addGlobal('googleAnalyticsKey', config.googleAnalyticsKey)
  njkEnv.addGlobal('lastTechnicalUpdate', services.technicalUpdatesService.getLatestTechnicalUpdateHeading())
  njkEnv.addGlobal('instrumentationKey', config.instrumentationKey)
}
