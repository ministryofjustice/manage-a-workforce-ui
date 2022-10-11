import userPreference from '../mockApis/userPreference'
import {
  resetAllocationStubs,
  resetProbationEstateStubs,
  resetUserPreferenceStubs,
  resetWorkloadStubs,
} from '../mockApis/wiremock'

import auth from '../mockApis/auth'
import tokenVerification from '../mockApis/tokenVerification'
import allocations from '../mockApis/allocations'
import probationRecord from '../mockApis/probationRecord'
import risk from '../mockApis/risk'
import allocateOffenderManagers from '../mockApis/allocateOffenderManagers'
import allocationConfirm from '../mockApis/allocationConfirm'
import workload from '../mockApis/workload'
import overview from '../mockApis/overview'
import allocationCase from '../mockApis/allocationCase'
import offenderManagerCases from '../mockApis/offenderManagerCases'
import staff from '../mockApis/staff'
import allocationComplete from '../mockApis/allocationComplete'
import person from '../mockApis/person'
import probationEstate from '../mockApis/probationEstate'

export default (on: (string, Record) => void): void => {
  on('task', {
    reset: async () => {
      return Promise.all([
        resetAllocationStubs(),
        resetWorkloadStubs(),
        resetProbationEstateStubs(),
        resetUserPreferenceStubs(),
      ])
    },

    getSignInUrl: auth.getSignInUrl,

    stubSetup: () =>
      Promise.all([
        auth.stubSignIn(),
        auth.stubAuthUser(),
        userPreference.stubUserPreferenceTeams(),
        allocations.stubGetUnallocatedCasesByTeams({
          teamCodes: 'TM1',
          response: [
            {
              teamCode: 'TM1',
              caseCount: 10,
            },
          ],
        }),
        allocations.stubGetAllocationsByTeam({ teamCode: 'TM1' }),
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
        probationEstate.stubGetTeamByCode({
          code: 'TM1',
          name: 'Wrexham - Team 1',
        }),
        probationEstate.stubGetPduDetails('WPTNWS'),
      ]),

    ...auth,
    ...tokenVerification,
    ...probationRecord,
    ...risk,
    ...allocations,
    ...allocateOffenderManagers,
    ...allocationConfirm,
    ...workload,
    ...offenderManagerCases,
    ...staff,
    ...allocationComplete,
    ...person,
    ...allocationCase,
    ...overview,
    ...probationEstate,
    ...userPreference,
  })
}
