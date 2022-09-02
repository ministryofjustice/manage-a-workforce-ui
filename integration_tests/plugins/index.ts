import { resetWorkloadStubs } from '../mockApis/workload-wiremock'
import { resetStubs, resetProbationEstateStubs } from '../mockApis/wiremock'

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
import selectTeams from '../mockApis/select-teams'
import probationEstate from '../mockApis/probationEstate'

export default (on: (string, Record) => void): void => {
  on('task', {
    reset: () =>
      resetStubs()
        .then(() => resetWorkloadStubs())
        .then(() => resetProbationEstateStubs()),

    getSignInUrl: auth.getSignInUrl,
    stubSignIn: auth.stubSignIn,

    stubAuthUser: auth.stubUser,
    stubAuthPing: auth.stubPing,

    stubTokenVerificationPing: tokenVerification.stubPing,

    stubGetAllocations: allocations.stubGetAllocations,

    stubGetNoAllocations: allocations.stubGetNoAllocations,

    stubOverOneHundredAllocations: allocations.stubOverOneHundredAllocations,

    stubGetUnallocatedCase: allocations.stubGetUnallocatedCase,

    stubGetUnallocatedCaseMultiOffences: allocations.stubGetUnallocatedCaseMultiOffences,

    stubGetUnallocatedCasesByTeams: allocations.stubGetUnallocatedCasesByTeams,

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

    stubGetTeamsByPdu: selectTeams.stubGetTeamsByPdu,

    stubGetTeamsByCodes: probationEstate.stubGetTeamsByCodes,
  })
}
