/* eslint-disable no-param-reassign */
import nunjucks from 'nunjucks'
import express from 'express'
import dayjs from 'dayjs'
import * as pathModule from 'path'
import config from '../config'

const production = process.env.NODE_ENV === 'production'

type Error = {
  href: string
  text: string
}

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

  njkEnv.addFilter('dateDifference', (startDate: string, endDate: string) => {
    const addOneDay = dayjs(endDate).add(1, 'day')
    const months = dayjs(addOneDay).diff(startDate, 'month')
    const days = dayjs(addOneDay).diff(startDate, 'day')
    return months < 1 ? `${days} days` : `${months} months`
  })

  njkEnv.addFilter('getCaseCount', (cases: number) => {
    return cases > 99 ? '99+' : `${cases}`
  })

  njkEnv.addGlobal('workloadMeasurementUrl', config.nav.workloadMeasurement.url)
  njkEnv.addGlobal('googleAnalyticsKey', config.googleAnalyticsKey)
}
