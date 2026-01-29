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

export default async function nunjucksSetup(
  app: express.Express,
  path: pathModule.PlatformPath,
  services: Services,
): Promise<void> {
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
      'node_modules/@ministryofjustice/hmpps-probation-frontend-components/dist/assets/',
    ],
    {
      autoescape: true,
      express: app,
    },
  )

  njkEnv.addFilter('initialiseName', initialiseName)

  njkEnv.addFilter('dateFormat', (date: string) => {
    return dayjs(date).format(config.dateFormat)
  })

  njkEnv.addFilter('timeFormat', (time: string) => {
    return dayjs(time).format('h:mma')
  })

  njkEnv.addFilter('findError', (array: Error[] | undefined, formFieldId: string) => {
    if (!array) return null
    const item = array.find(error => error.href === `#${formFieldId}`)
    return item ? { text: item.text } : null
  })

  njkEnv.addFilter('getCaseCount', (cases: number) => {
    return cases > 99 ? '99+' : `${cases}`
  })

  njkEnv.addFilter('isArray', (str: string | string[]) => {
    return Array.isArray(str)
  })

  njkEnv.addGlobal('workloadMeasurementUrl', config.nav.workloadMeasurement.url)
  njkEnv.addGlobal('tagManagerContainerId', config.analytics.tagManagerContainerId.trim())
  njkEnv.addGlobal('lastTechnicalUpdate', services.technicalUpdatesService.getLatestTechnicalUpdateHeading())
  njkEnv.addGlobal('instrumentationKey', config.instrumentationKey)
}
