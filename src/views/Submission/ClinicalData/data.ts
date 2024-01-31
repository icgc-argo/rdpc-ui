import {
	ClinicalEntityQueryResponse,
	ClinicalEntitySearchResultResponse,
	ClinicalFilter,
	CompletionStates,
} from './types';

export const clinicalEntityDisplayNames = {
	donor: 'Donor',
	sampleRegistration: 'Sample Registration',
	sample_registration: 'Sample Registration',
	specimens: 'Specimen',
	specimen: 'Specimen',
	primaryDiagnoses: 'Primary Diagnosis',
	primary_diagnosis: 'Primary Diagnosis',
	treatment: 'Treatment',
	chemotherapy: 'Chemotherapy',
	hormoneTherapy: 'Hormone Therapy',
	hormone_therapy: 'Hormone Therapy',
	immunotherapy: 'Immunotherapy',
	radiation: 'Radiation',
	surgery: 'Surgery',
	followUps: 'Follow Up',
	follow_up: 'Follow Up',
	familyHistory: 'Family History',
	family_history: 'Family History',
	exposure: 'Exposure',
	comorbidity: 'Comorbidity',
	biomarker: 'Biomarker',
} as const;

export const aliasedEntityNames = {
	donor: 'donor',
	sampleRegistration: 'sample_registration',
	specimens: 'specimen',
	primaryDiagnoses: 'primary_diagnosis',
	familyHistory: 'family_history',
	treatment: 'treatment',
	chemotherapy: 'chemotherapy',
	immunotherapy: 'immunotherapy',
	surgery: 'surgery',
	radiation: 'radiation',
	followUps: 'follow_up',
	hormoneTherapy: 'hormone_therapy',
	exposure: 'exposure',
	comorbidity: 'comorbidity',
	biomarker: 'biomarker',
};

type AliasedEntityNamesKeys = keyof typeof aliasedEntityNames;
export const clinicalEntityFields = Object.keys(aliasedEntityNames) as AliasedEntityNamesKeys[];
export const aliasedEntityFields = Object.values(aliasedEntityNames);

// Util for finding camelCase alias for snake_case values
export const reverseLookUpEntityAlias = (selectedClinicalEntity: string) => {
	const findAlias = Object.entries(aliasedEntityNames).find(
		([key, value]) => value === selectedClinicalEntity,
	);

	return findAlias ? findAlias[0] : 'donor';
};

export const aliasSortNames = {
	donor_id: 'donorId',
	program_id: 'programId',
	submitter_id: 'submitterId',
	DO: 'donorId',
	PD: 'primaryDiagnoses',
	NS: 'specimens',
	TS: 'familyHistory',
	TR: 'treatments',
	FO: 'followUps',
};

export const defaultClinicalEntityFilters: ClinicalFilter = {
	entityTypes: clinicalEntityFields,
	page: 0,
	pageSize: 20,
	donorIds: [],
	submitterDonorIds: [],
	completionState: CompletionStates['all'],
	sort: aliasSortNames.donor_id,
};

export const hasClinicalErrors = (
	{ clinicalErrors }: ClinicalEntityQueryResponse['clinicalData'],
	currentEntity: string,
) =>
	clinicalErrors &&
	clinicalErrors.length > 0 &&
	clinicalErrors.filter(
		(donor) =>
			donor.errors &&
			donor.errors.some(
				({ entityName }) =>
					aliasedEntityFields.includes(entityName) &&
					reverseLookUpEntityAlias(entityName) === currentEntity,
			),
	).length > 0;

export const emptyClinicalDataResponse: ClinicalEntityQueryResponse = {
	clinicalData: {
		clinicalEntities: [],
		clinicalErrors: [],
	},
};

export const emptySearchResponse: ClinicalEntitySearchResultResponse = {
	clinicalSearchResults: {
		searchResults: [],
		totalResults: 0,
	},
};
