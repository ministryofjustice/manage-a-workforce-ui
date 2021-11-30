/* eslint-disable no-param-reassign */
import nunjucks from 'nunjucks'
import express from 'express'
import dayjs from 'dayjs'
import * as pathModule from 'path'
import config from '../config'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, path: pathModule.PlatformPath): void {
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
      'node_modules/govuk-frontend/',
      'node_modules/govuk-frontend/components/',
      'node_modules/@ministryofjustice/frontend/',
      'node_modules/@ministryofjustice/frontend/moj/components/',
    ],
    {
      autoescape: true,
      express: app,
    }
  )

  njkEnv.addFilter('initialiseName', (fullName: string) => {
    // this check is for the authError page
    if (!fullName) {
      return null
    }
    const array = fullName.split(' ')
    return `${array[0][0]}. ${array.reverse()[0]}`
  })

  njkEnv.addFilter('dateFormat', (date: string) => {
    return dayjs(date).format('D MMM YYYY')
  })

  njkEnv.addFilter('calculateDays', (date: string) => {
    const appt = dayjs(date).format('D MMM YYYY')
    const today = dayjs().format('D MMM YYYY')

    const diffInDays = dayjs(appt).diff(today, 'day')

    switch (diffInDays) {
      case 0:
        return 'Today'
      case 1:
        return 'Tomorrow'
      case 2:
        return 'In 2 days'
      case 3:
        return 'In 3 days'
      case 4:
        return 'In 4 days'
      case 5:
        return 'In 5 days'
      case 6:
        return 'In 6 days'
      case 7:
        return 'In 7 days'
      default:
        return 'Overdue'
    }
  })

  njkEnv.addGlobal('workloadMeasurementUrl', config.nav.workloadMeasurement.url)
}
