export const validateEntityQueryName = (entityQuery) => {
	const entities = typeof entityQuery === 'string' ? [entityQuery] : entityQuery;
	return entities.map((entityName) => clinicalEntityFields.find((entity) => entity === entityName));
};

export const getColumnWidth = memoize<
	(keyString: string, showCompletionStats: boolean, noData: boolean) => number
>((keyString, showCompletionStats, noData) => {
	const minWidth = keyString === 'donor_id' ? 70 : showCompletionStats ? 40 : 95;
	const maxWidth = noData && showCompletionStats ? 45 : 200;
	const spacePerChar = 8;
	const margin = 10;
	const targetWidth = keyString.length * spacePerChar + margin;
	return Math.max(Math.min(maxWidth, targetWidth), minWidth);
});
