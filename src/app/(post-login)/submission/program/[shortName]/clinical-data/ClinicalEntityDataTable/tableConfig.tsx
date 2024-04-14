export const errorColumns = [
	{
		accessorKey: 'entries',
		Header: '# Affected Records',
		id: 'entries',
		maxWidth: 135,
	},
	{
		accessorKey: 'fieldName',
		Header: `Field with Error`,
		id: 'fieldName',
		maxWidth: 215,
	},
	{
		accessorKey: 'errorMessage',
		Header: `Error Description`,
		id: 'errorMessage',
	},
];

export const completionKeys = Object.values(aliasSortNames);
export const completionColumnNames = Object.keys(aliasSortNames);
export const emptyCompletion = {
	DO: 0,
	PD: 0,
	FO: 0,
	NS: 0,
	TR: 0,
	TS: 0,
};

export const noDataCompletionStats = [
	{
		donor_id: 0,
		...emptyCompletion,
	},
];

const completionColumnHeaders = {
	donor: 'DO',
	primaryDiagnosis: 'PD',
	normalSpecimens: 'NS',
	tumourSpecimens: 'TS',
	treatments: 'TR',
	followUps: 'FO',
};

export const coreCompletionFields = Object.keys(completionColumnHeaders);

export const defaultEntityPageSettings = {
	page: defaultClinicalEntityFilters.page,
	pageSize: defaultClinicalEntityFilters.pageSize,
	sorted: [{ id: 'donorId', desc: true }],
};

export const defaultDonorSettings = {
	...defaultEntityPageSettings,
	sorted: [{ id: 'completionStats.coreCompletionPercentage', desc: false }],
};

export const defaultErrorPageSettings = {
	page: 0,
	pageSize: 5,
	sorted: [{ id: 'donorId', desc: true }],
};
