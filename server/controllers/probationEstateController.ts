import { Request, Response } from 'express'
import EstateRegion from '../models/EstateRegion'
import ProbationEstateService from '../services/probationEstateService'
import UserPreferenceService from '../services/userPreferenceService'
import RegionDetails from '../models/RegionDetails'
import ProbationDeliveryUnitDetails from '../models/ProbationDeliveryUnitDetails'
import AllocationsService from '../services/allocationsService'

export default class ProbationEstateController {
  constructor(
    private readonly probationEstateService: ProbationEstateService,
    private readonly userPreferenceService: UserPreferenceService,
    private readonly allocationsService: AllocationsService,
  ) {}

  async getPduTeams(req: Request, res: Response, pduCode, error = false) {
    const response: ProbationDeliveryUnitDetails = await this.probationEstateService.getProbationDeliveryUnitDetails(
      res.locals.user.token,
      pduCode,
    )

    await this.allocationsService.getUserRegionAccessForRegion(
      res.locals.user.token,
      res.locals.user.username,
      response.region.code,
    )

    res.render('pages/select-teams', {
      title: 'Select your teams | Manage a workforce',
      data: response.teams.sort((a, b) => a.name.localeCompare(b.name)),
      error,
      pduName: response.name,
      regionName: response.region.name,
    })
  }

  async selectPduTeams(req: Request, res: Response, pduCode) {
    await this.allocationsService.getUserRegionAccessForPdu(res.locals.user.token, res.locals.user.username, pduCode)

    const {
      body: { team },
    } = req
    if (team) {
      const teamCodes = Array.isArray(team) ? team : [team]
      await this.userPreferenceService.saveTeamsUserPreference(
        res.locals.user.token,
        res.locals.user.username,
        teamCodes,
      )
      await this.userPreferenceService.savePduUserPreference(res.locals.user.token, res.locals.user.username, pduCode)

      return res.redirect(`/pdu/${pduCode}/teams`)
    }
    return this.getPduTeams(req, res, pduCode, true)
  }

  async getRegions(req: Request, res: Response, error = false) {
    const response: EstateRegion[] = await this.probationEstateService.getRegions(res.locals.user.token)
    const userRegions = (
      await this.allocationsService.getRegionsForUser(res.locals.user.token, res.locals.user.username)
    ).regions

    const regions = response.map(item => {
      return { allowed: userRegions.includes(item.code), code: item.code, name: item.name }
    })

    res.render('pages/select-region', {
      title: 'Select your region | Manage a workforce',
      data: regions.sort((a, b) => a.name.localeCompare(b.name)),
      error,
    })
  }

  async selectRegion(req: Request, res: Response) {
    const {
      body: { region },
    } = req
    if (region) {
      return res.redirect(`/region/${region}/probationDeliveryUnits`)
    }
    return this.getRegions(req, res, true)
  }

  async getProbationDeliveryUnitsByRegionCode(req: Request, res: Response, regionCode, error = false) {
    await this.allocationsService.getUserRegionAccessForRegion(
      res.locals.user.token,
      res.locals.user.username,
      regionCode,
    )
    const response: RegionDetails = await this.probationEstateService.getRegionDetails(
      res.locals.user.token,
      regionCode,
    )
    res.render('pages/select-probation-delivery-unit', {
      title: 'Select your PDU | Manage a workforce',
      regionName: response.name,
      probationDeliveryUnits: response.probationDeliveryUnits.sort((a, b) => a.name.localeCompare(b.name)),
      error,
    })
  }

  async selectProbationDeliveryUnit(req: Request, res: Response, regionCode) {
    await this.allocationsService.getUserRegionAccessForRegion(
      res.locals.user.token,
      res.locals.user.username,
      regionCode,
    )
    const {
      body: { probationDeliveryUnit },
    } = req
    if (probationDeliveryUnit) {
      return res.redirect(`/pdu/${probationDeliveryUnit}/select-teams`)
    }
    return this.getProbationDeliveryUnitsByRegionCode(req, res, regionCode, true)
  }
}
