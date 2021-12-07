/* eslint-disable no-param-reassign */
import nunjucks from 'nunjucks'
import express from 'express'
import dayjs from 'dayjs'
import * as pathModule from 'path'
import moment from 'moment-business-days'
import config from '../config'
import applyBankHols from './bankHolidays'

const production = process.env.NODE_ENV === 'production'

export default function nunjucksSetup(app: express.Express, path: pathModule.PlatformPath): void {
  app.set('view engine', 'njk')
  app.locals.asset_path = '/assets/'
  app.locals.applicationName = 'Manage A Workforce Ui'

  applyBankHols()

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

  njkEnv.addFilter('getCaseCount', (cases: number) => {
    return cases > 99 ? '99+' : `${cases}`
  })

  njkEnv.addFilter('calculateDays', (date: string) => {
    const appt = dayjs(date).format('D MMM YYYY')
    const today = dayjs().format('D MMM YYYY')

    const diffInDays = dayjs(appt).diff(today, 'day')

    switch (true) {
      case diffInDays === 0:
        return 'Today'
      case diffInDays === 1:
        return 'Tomorrow'
      case diffInDays >= 2:
        return `In ${diffInDays} days`
      default:
        return 'Overdue'
    }
  })

  njkEnv.addFilter('overdueFlag', (days: string) => {
    return days === 'Today' || days === 'Tomorrow' || days === 'In 2 days' || days === 'Overdue'
  })

  njkEnv.addFilter('calculateBusinessDays', (sentenceDate: string) => {
    const addFiveBusinessDays = moment(sentenceDate, 'YYYY-MM-DD').businessAdd(5, 'days').format('YYYY-MM-DD')
    const apptDue = moment(addFiveBusinessDays, 'YYYY-MM-DD').businessDiff(moment(config.currentDate, 'YYYY-MM-DD'))

    if (apptDue > 5) {
      return 'Overdue'
    }
    if (apptDue === 1) {
      return 'Due tomorrow'
    }
    if (apptDue === 0) {
      return 'Due today'
    }
    return `Due in ${apptDue} days`
  })

  njkEnv.addGlobal('workloadMeasurementUrl', config.nav.workloadMeasurement.url)
}
