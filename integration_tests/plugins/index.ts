import userPreference from '../mockApis/userPreference'
import {
  resetAllocationStubs,
  resetProbationEstateStubs,
  resetUserPreferenceStubs,
  resetWorkloadStubs,
  resetStaffLookupStubs,
} from '../mockApis/wiremock'

import auth from '../mockApis/auth'
import tokenVerification from '../mockApis/tokenVerification'
import allocations from '../mockApis/allocations'
import probationRecord from '../mockApis/probationRecord'
import risk from '../mockApis/risk'
import choosePractitioner from '../mockApis/choosePractitioner'
import allocateToPractitioner from '../mockApis/allocateToPractitioner'
import workload from '../mockApis/workload'
import overview from '../mockApis/overview'
import allocationCase from '../mockApis/allocationCase'
import offenderManagerCases from '../mockApis/offenderManagerCases'
import allocationComplete from '../mockApis/allocationComplete'
import probationEstate from '../mockApis/probationEstate'
import staffLookup from '../mockApis/staffLookup'

export default (on: (string, Record) => void): void => {
  on('task', {
    stubSetup: async () => {
      await Promise.all([
        resetAllocationStubs(),
        resetWorkloadStubs(),
        resetProbationEstateStubs(),
        resetUserPreferenceStubs(),
        resetStaffLookupStubs(),
      ])
      return Promise.all([
        auth.stubSignIn(),
        auth.stubAuthUser(),
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
    ...offenderManagerCases,
    ...allocationComplete,
    ...allocationCase,
    ...overview,
    ...probationEstate,
    ...userPreference,
    ...choosePractitioner,
    ...staffLookup,
  })
}
