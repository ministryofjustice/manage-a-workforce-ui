import moment from 'moment-business-days'
import axios from 'axios'
import logger from '../../logger'

const getBankHolidays = async () => {
  let response = {}
  const url = 'https://www.gov.uk/bank-holidays.json'
  try {
    response = await axios.get(url)
  } catch (error) {
    return error.response
  }
  return response
}

const applyBankHols = async () => {
  return getBankHolidays().then(data => {
    const dates = data.data['england-and-wales'].events.map(holiday => holiday.date)
    moment.updateLocale('en', {
      holidays: dates,
      holidayFormat: 'YYYY-MM-DD',
    })
    logger.info(`adding bank holidays: ${dates}`)
  })
}

export default applyBankHols
