import wiremock from './wiremock'

const url = 'http://localhost:9091/__admin'
const { stubFor, getRequests, resetStubs } = wiremock(url)
export { stubFor, getRequests, resetStubs }
