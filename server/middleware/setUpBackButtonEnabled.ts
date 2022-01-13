import { RequestHandler } from 'express'
import config from '../config'

export default function setUpBackButtonEnabled(): RequestHandler {
  return (req, res, next) => {
    const secFetchSite = req.get('Sec-Fetch-Site')
    const referer = req.get('Referer')
    if ((secFetchSite && secFetchSite === 'same-origin') || (referer && referer.startsWith(config.domain))) {
      res.locals.enableBackButton = true
    }
    return next()
  }
}
