export type ClinicalFilter = {
	entityTypes: string[];
	page: number;
	pageSize: number;
	donorIds?: string[];
	submitterDonorIds?: string[];
	completionState?: CompletionStates;
	sort?: string;
};

export enum CompletionStates {
	all = 'all',
	invalid = 'invalid',
	complete = 'complete',
	incomplete = 'incomplete',
}
