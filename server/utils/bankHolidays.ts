import moment from 'moment-business-days'
import axios from 'axios'
import logger from '../../logger'

const getBankHolidays = async () => {
  try {
    return axios.get('https://www.gov.uk/bank-holidays.json')
  } catch (error) {
    return error.response
  }
}

const applyBankHols = async () => {
  const { data } = await getBankHolidays()
  const dates = data['england-and-wales'].events.map(holiday => holiday.date)
  moment.updateLocale('en', {
    holidays: dates,
    holidayFormat: 'YYYY-MM-DD',
  })
  logger.info(`adding bank holidays: ${dates}`)
}

export default applyBankHols
