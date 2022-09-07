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
        auth.stubUser(),
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
        allocations.stubGetAllocationsByTeam({ teamCode: 'N03F01' }),
        probationEstate.stubGetTeamByCode({
          code: 'N03F01',
          name: 'Wrexham - Team 1',
        }),
      ]),

    stubAuthUser: auth.stubUser,
    stubAuthPing: auth.stubPing,

    stubTokenVerificationPing: tokenVerification.stubPing,

    stubGetAllocations: allocations.stubGetAllocations,

    stubGetAllocationsByTeam: allocations.stubGetAllocationsByTeam,

    stubGetNoAllocations: allocations.stubGetNoAllocations,

    stubOverOneHundredAllocations: allocations.stubOverOneHundredAllocations,

    stubGetUnallocatedCase: allocations.stubGetUnallocatedCase,

    stubGetUnallocatedCaseMultiOffences: allocations.stubGetUnallocatedCaseMultiOffences,

    stubGetUnallocatedCasesByTeams: allocations.stubGetUnallocatedCasesByTeams,

    stubOverOneHundredAllocationsByTeam: allocations.stubOverOneHundredAllocationsByTeam,

    stubGetProbationRecord: probationRecord.stubGetProbationRecord,

    stubGetProbationRecordNoConvictions: probationRecord.stubGetProbationRecordNoConvictions,

    stubGetProbationRecordMultipleOffences: probationRecord.stubGetProbationRecordMultipleOffences,

    stubGetManyPreviousProbationRecord: probationRecord.stubGetManyPreviousProbationRecord,

    stubGetRisk: risk.stubGetRisk,

    stubGetRiskNoRegistrations: risk.stubGetRiskNoRegistrations,

    stubGetUnallocatedCasePreviouslyManaged: allocations.stubGetUnallocatedCasePreviouslyManaged,

    stubGetUnallocatedCaseNewToProbation: allocations.stubGetUnallocatedCaseNewToProbation,

    stubGetUnallocatedCaseNoOffenderManager: allocations.stubGetUnallocatedCaseNoOffenderManager,

    stubGetAllocateOffenderManagers: allocateOffenderManagers.stubGetAllocateOffenderManagers,

    stubGetCurrentlyManagedCaseOverview: allocationCase.stubGetCurrentlyManagedCaseOverview,

    stubGetCurrentlyManagedNoOffenderManagerCaseOverview:
      allocationCase.stubGetCurrentlyManagedNoOffenderManagerCaseOverview,

    stubGetPreviouslyManagedCaseOverview: allocationCase.stubGetPreviouslyManagedCaseOverview,

    stubGetNewToProbationCaseOverview: allocationCase.stubGetNewToProbationCaseOverview,

    stubGetPotentialOffenderManagerWorkload: allocationConfirm.stubGetPotentialOffenderManagerWorkload,

    stubGetPotentialOffenderManagerWorkloadOverCapacity:
      allocationConfirm.stubGetPotentialOffenderManagerWorkloadOverCapacity,

    stubWorkloadCases: workload.stubWorkloadCases,

    stubGetOverview: overview.stubGetOverview,

    stubGetOverviewUnderCapacity: overview.stubGetOverviewUnderCapacity,

    stubGetOffenderManagerCases: offenderManagerCases.stubGetOffenderManagerCases,

    stubGetStaffByCode: staff.stubGetStaffByCode,

    stubAllocateOffenderManagerToCase: allocationComplete.stubAllocateOffenderManagerToCase,

    stubAllocateOffenderManagerToCaseMultipleEmails: allocationComplete.stubAllocateOffenderManagerToCaseMultipleEmails,

    stubGetPersonById: person.stubGetPersonById,

    stubGetCaseOverviewNoInitialAppointment: allocationCase.stubGetCaseOverviewNoInitialAppointment,

    stubGetCaseOverviewCustodyCase: allocationCase.stubGetCaseOverviewCustodyCase,

    stubGetOverviewWithLastAllocatedEvent: overview.stubGetOverviewWithLastAllocatedEvent,

    stubGetTeamsByPdu: probationEstate.stubGetTeamsByPdu,

    stubGetTeamsByCodes: probationEstate.stubGetTeamsByCodes,

    stubGetTeamByCode: probationEstate.stubGetTeamByCode,

    stubUserPreferenceTeams: userPreference.stubUserPreferenceTeams,

    stubPutUserPreferenceTeams: userPreference.stubPutUserPreferenceTeams,

    verifyPutUserPreferenceTeams: userPreference.verifyPutUserPreferenceTeams,
  })
}
