import { useState } from 'react';
import { defaultClinicalEntityFilters } from '../common';

export const defaultEntityPageSettings = {
	page: defaultClinicalEntityFilters.page,
	pageSize: defaultClinicalEntityFilters.pageSize,
	sorted: [{ id: 'donorId', desc: true }],
};

export const defaultDonorSettings = {
	...defaultEntityPageSettings,
	sorted: [{ id: 'completionStats.coreCompletionPercentage', desc: false }],
};

export const usePageSettings = (defaultState) => {
	const [pageSettings, setPageSettings] = useState(defaultState);
	const { page, pageSize, sorted } = pageSettings;
	return [pageSettings, setPageSettings];
};
