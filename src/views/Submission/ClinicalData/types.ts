export enum CoreCompletionEntities {
	donor = 'donor',
	primaryDiagnosis = 'primaryDiagnosis',
	specimens = 'specimens',
	treatments = 'treatments',
	followUps = 'followUps',
}

export type CoreCompletion = {
	[field in CoreCompletionEntities]: number;
};

export type CompletionStats = {
	coreCompletion: CoreCompletion;
	coreCompletionDate: string;
	coreCompletionPercentage: number;
	donorId: number;
	overriddenCoreCompletion: [CoreCompletionEntities];
	entityData?: CompletionEntityData;
};

export type CompletionEntityData = {
	specimens?: SpecimenCoreCompletion;
};

export type SpecimenCoreCompletion = {
	coreCompletionPercentage: number;
	normalSpecimensPercentage: number;
	tumourSpecimensPercentage: number;
	normalRegistrations: number;
	normalSubmissions: number;
	tumourRegistrations: number;
	tumourSubmissions: number;
};

export enum CompletionStates {
	all = 'all',
	invalid = 'invalid',
	complete = 'complete',
	incomplete = 'incomplete',
}

export type ClinicalEntity = {
	entityName: string;
	entityFields: string[];
	totalDocs: number;
	completionStats?: Array<CompletionStats>;
	records: Array<{
		name: string;
		value: any;
	}>[];
};

export type ClinicalSearchResult = {
	donorId: number;
	submitterDonorId: string;
};

export type ClinicalErrorData = {
	donorId: number;
	submitterDonorId: string;
	errors: {
		entityName: string;
		errorType: string;
		fieldName: string;
		index: number;
		info: { value: string[] };
		message: string;
	}[];
};

export type ClinicalEntityQueryResponse = {
	clinicalData: {
		programShortName?: string;
		clinicalEntities: Array<ClinicalEntity>;
		clinicalErrors: Array<ClinicalErrorData>;
	};
};

export type ClinicalEntitySearchResultResponse = {
	clinicalSearchResults: {
		programShortName?: string;
		totalResults: number;
		searchResults: Array<ClinicalSearchResult>;
	};
};

export type ClinicalFilter = {
	entityTypes: string[];
	page: number;
	pageSize: number;
	donorIds?: string[];
	submitterDonorIds?: string[];
	completionState?: CompletionStates;
	sort?: string;
};

export type TsvDownloadIds = { donorIds: number[]; submitterDonorIds: string[] };
