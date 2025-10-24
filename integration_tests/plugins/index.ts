import RedisService from '../redis/redisService'
import userPreference from '../mockApis/userPreference'
import {
  resetAllocationStubs,
  resetProbationEstateStubs,
  resetUserPreferenceStubs,
  resetWorkloadStubs,
  resetStaffLookupStubs,
  resetManageUsersStubs,
  resetLaoStubs,
  resetLaoStubs403,
  resetStaffLaoStatusByCrns,
  resetStaffLaoStatusByCrnsRestricted,
  resetFeatureflag,
} from '../mockApis/wiremock'

import auth from '../mockApis/auth'
import manageUsers from '../mockApis/manageUsers'
import tokenVerification from '../mockApis/tokenVerification'
import allocations from '../mockApis/allocations'
import probationRecord from '../mockApis/probationRecord'
import risk from '../mockApis/risk'
import choosePractitioner from '../mockApis/choosePractitioner'
import allocateToPractitioner from '../mockApis/allocateToPractitioner'
import workload from '../mockApis/workload'
import teamWorkload from '../mockApis/teamWorkload'
import overview from '../mockApis/overview'
import allocationCase from '../mockApis/allocationCase'
import offenderManagerCases from '../mockApis/offenderManagerCases'
import allocationComplete from '../mockApis/allocationComplete'
import probationEstate from '../mockApis/probationEstate'
import staffLookup from '../mockApis/staffLookup'
import logging from '../mockApis/logging'
import laoStatus from '../mockApis/laoStatus'
import laoStatus403 from '../mockApis/laoStatus403'
import allowedRegions from '../mockApis/allowedRegions'
import featureFlags from '../mockApis/featureFlags'

const redisService = new RedisService()

export default (on: (string, Record) => void): void => {
  on('task', {
    stubSetup: async () => {
      await Promise.all([
        resetAllocationStubs(),
        resetWorkloadStubs(),
        resetProbationEstateStubs(),
        resetUserPreferenceStubs(),
        resetStaffLookupStubs(),
        resetManageUsersStubs(),
        resetLaoStubs(),
        resetLaoStubs403(),
        redisService.deleteAll(),
        resetStaffLaoStatusByCrns(),
        resetStaffLaoStatusByCrnsRestricted(),
      ])
      return Promise.all([
        auth.stubSignIn(),
        manageUsers.stubAuthUser(),
        userPreference.stubUserPreferencePDU(),
        userPreference.stubUserPreferenceTeams(),
        userPreference.stubUserPreferenceAllocationDemand({
          pduCode: 'PDU1',
          lduCode: 'LDU1',
          teamCode: 'TM1',
        }),
        allocations.stubGetUnallocatedCasesByTeams({
          teamCodes: 'TM1',
          response: [
            {
              teamCode: 'TM1',
              caseCount: 10,
            },
          ],
        }),
        probationEstate.stubGetTeamsByCodes({
          codes: 'TM1',
          response: [
            {
              code: 'TM1',
              name: 'Team 1',
            },
          ],
        }),
        workload.stubWorkloadCases({
          teamCodes: 'TM1',
          response: [
            {
              teamCode: 'TM1',
              totalCases: 2,
              workload: 77,
            },
          ],
        }),
        probationEstate.stubGetPduDetails(),
      ])
    },

    ...auth,
    ...tokenVerification,
    ...probationRecord,
    ...risk,
    ...allocations,
    ...allocateToPractitioner,
    ...workload,
    ...teamWorkload,
    ...offenderManagerCases,
    ...allocationComplete,
    ...allocationCase,
    ...overview,
    ...probationEstate,
    ...userPreference,
    ...choosePractitioner,
    ...staffLookup,
    ...laoStatus,
    ...laoStatus403,
    ...allowedRegions,
    ...featureFlags,
    ...logging,
  })
}
