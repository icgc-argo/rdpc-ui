/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import { ClinicalSearchResults } from '@/__generated__/clinical/graphql';
import ErrorNotification from '@/app/components/ErrorNotification';
import { TableInfoHeaderContainer } from '@/app/components/Table/common';
import CLINICAL_ENTITY_DATA_QUERY from '@/app/gql/clinical/CLINICAL_ENTITY_DATA_QUERY';
import CLINICAL_SCHEMA_VERSION from '@/app/gql/clinical/CLINICAL_SCHEMA_VERSION';
import { useAppConfigContext } from '@/app/hooks/AppProvider';
import { useClinicalQuery } from '@/app/hooks/useApolloQuery';
import { PROGRAM_CLINICAL_SUBMISSION_PATH, PROGRAM_SHORT_NAME_PATH } from '@/global/constants';
import {
	ContentPlaceholder,
	DnaLoader,
	Icon,
	Link,
	NOTIFICATION_VARIANTS,
	Table,
	Typography,
	css,
	useTheme,
} from '@icgc-argo/uikit';
import memoize from 'lodash/memoize';
import { createRef, useEffect, useState } from 'react';
import urljoin from 'url-join';
import {
	Cell,
	ClinicalCoreCompletionHeader,
	TopLevelHeader,
	styleThickBorder,
} from './ClinicalDataTableComp';
import {
	ClinicalEntitySearchResultResponse,
	CompletionStates,
	aliasSortNames,
	aliasedEntityFields,
	aliasedEntityNames,
	clinicalEntityDisplayNames,
	clinicalEntityFields,
	defaultClinicalEntityFilters,
	emptyClinicalDataResponse,
	emptySearchResponse,
} from './common';

export type DonorEntry = {
	row: string;
	isNew: boolean;
	[k: string]: string | number | boolean;
};

const errorColumns = [
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

const NoDataCell = () => (
	<div
		css={css`
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 80px 0;
		`}
	>
		<ContentPlaceholder title="No Data Found.">
			<img alt="No Data" src="/assets/no-data.svg" />
		</ContentPlaceholder>
	</div>
);

const completionKeys = Object.values(aliasSortNames);
const completionColumnNames = Object.keys(aliasSortNames);
const emptyCompletion = {
	DO: 0,
	PD: 0,
	FO: 0,
	NS: 0,
	TR: 0,
	TS: 0,
};

const noDataCompletionStats = [
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

const coreCompletionFields = Object.keys(completionColumnHeaders);

const getColumnWidth = memoize<
	(keyString: string, showCompletionStats: boolean, noData: boolean) => number
>((keyString, showCompletionStats, noData) => {
	const minWidth = keyString === 'donor_id' ? 70 : showCompletionStats ? 40 : 95;
	const maxWidth = noData && showCompletionStats ? 45 : 200;
	const spacePerChar = 8;
	const margin = 10;
	const targetWidth = keyString.length * spacePerChar + margin;
	return Math.max(Math.min(maxWidth, targetWidth), minWidth);
});

const defaultEntityPageSettings = {
	page: defaultClinicalEntityFilters.page,
	pageSize: defaultClinicalEntityFilters.pageSize,
	sorted: [{ id: 'donorId', desc: true }],
};

const defaultDonorSettings = {
	...defaultEntityPageSettings,
	sorted: [{ id: 'completionStats.coreCompletionPercentage', desc: false }],
};

const defaultErrorPageSettings = {
	page: 0,
	pageSize: 5,
	sorted: [{ id: 'donorId', desc: true }],
};

const validateEntityQueryName = (entityQuery) => {
	const entities = typeof entityQuery === 'string' ? [entityQuery] : entityQuery;
	return entities.map((entityName) => clinicalEntityFields.find((entity) => entity === entityName));
};

export const useGetEntityData = (
	program: string,
	entityType: string | string[],
	page: number,
	pageSize: number,
	sort: string,
	completionState: CompletionStates,
	donorIds: number[],
	submitterDonorIds: string[],
) =>
	useClinicalQuery(CLINICAL_ENTITY_DATA_QUERY, {
		errorPolicy: 'all',
		fetchPolicy: 'cache-and-network',
		variables: {
			programShortName: program,
			filters: {
				...defaultClinicalEntityFilters,
				sort,
				page,
				pageSize,
				completionState,
				donorIds,
				submitterDonorIds,
				entityTypes: validateEntityQueryName(entityType),
			},
		},
	});

const DashIcon = (
	<svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M1 1H9" stroke="#BABCC2" strokeWidth="2" strokeLinecap="round" />
	</svg>
);

const ClinicalEntityDataTable = ({
	entityType,
	program,
	completionState = CompletionStates['all'],
	currentDonors,
	donorSearchResults = emptySearchResponse,
	useDefaultQuery,
	noData,
}: {
	entityType: string;
	program: string;
	completionState: CompletionStates;
	currentDonors: number[];
	donorSearchResults: ClinicalEntitySearchResultResponse;
	useDefaultQuery: boolean;
	noData: boolean;
}) => {
	const { DOCS_URL_ROOT } = useAppConfigContext();
	const DOCS_DICTIONARY_PAGE = urljoin(DOCS_URL_ROOT, '/dictionary/');

	// Init + Page Settings
	let totalDocs = 0;
	let showCompletionStats = false;
	let records = [];
	let columns = [];
	const theme = useTheme();
	const containerRef = createRef<HTMLDivElement>();
	const defaultPageSettings =
		useDefaultQuery && entityType === 'donor' ? defaultDonorSettings : defaultEntityPageSettings;
	const [pageSettings, setPageSettings] = useState(defaultPageSettings);
	const { page, pageSize, sorted } = pageSettings;
	const [errorPageSettings, setErrorPageSettings] = useState(defaultErrorPageSettings);
	const { page: errorPage, pageSize: errorPageSize, sorted: errorSorted } = errorPageSettings;
	const { desc, id } = sorted[0];
	const sortKey = aliasSortNames[id] || id;
	const sort = `${desc ? '-' : ''}${sortKey}`;

	const {
		clinicalSearchResults: { searchResults, totalResults },
	} = donorSearchResults || emptySearchResponse;

	const nextSearchPage = (page + 1) * pageSize;

	const donorIds = useDefaultQuery
		? []
		: currentDonors.length
		? currentDonors
		: searchResults.map(({ donorId }: ClinicalSearchResults) => donorId);

	const submitterDonorIds =
		useDefaultQuery || currentDonors.length
			? []
			: searchResults
					.map(({ submitterDonorId }: ClinicalSearchResults) => submitterDonorId)
					.filter((id) => !!id)
					.slice(page * pageSize, nextSearchPage < totalResults ? nextSearchPage : totalResults);

	const latestDictionaryResponse = useClinicalQuery(CLINICAL_SCHEMA_VERSION);
	const Subtitle = ({ program = '' }) => (
		<div
			css={css`
				margin-bottom: 12px;
			`}
		>
			<Link target="_blank" href={DOCS_DICTIONARY_PAGE}>
				{!latestDictionaryResponse.loading &&
					`Version ${latestDictionaryResponse.data.clinicalSubmissionSchemaVersion}`}
			</Link>{' '}
			of the data dictionary was released and has made some donors invalid. Please download the
			error report to view the affected donors, then submit a corrected TSV file in the{' '}
			<Link href={PROGRAM_CLINICAL_SUBMISSION_PATH.replace(PROGRAM_SHORT_NAME_PATH, program)}>
				Submit Clinical Data{' '}
			</Link>
			workspace.
		</div>
	);

	const updatePageSettings = (key, value) => {
		const newPageSettings = { ...pageSettings, [key]: value };

		if (key === 'pageSize' && value !== pageSettings.pageSize) {
			// Prevents bug querying nonexistent data
			newPageSettings.page = 0;
		}
		setPageSettings(newPageSettings);
		return newPageSettings;
	};

	useEffect(() => {
		setPageSettings(defaultPageSettings);
		setErrorPageSettings(defaultErrorPageSettings);
	}, [entityType, useDefaultQuery]);

	const { data: clinicalEntityData, loading } = useGetEntityData(
		program,
		entityType,
		page,
		pageSize,
		sort,
		completionState,
		donorIds,
		submitterDonorIds,
	);

	const { clinicalData } =
		clinicalEntityData === undefined || loading ? emptyClinicalDataResponse : clinicalEntityData;

	const noTableData = noData || clinicalData.clinicalEntities.length === 0;

	// Collect Error Data
	const { clinicalErrors = [] } = clinicalData;
	const tableErrorGroups = [];

	clinicalErrors.forEach((donor) => {
		const relatedErrors = donor.errors.filter(
			(error) => error.entityName === aliasedEntityNames[entityType],
		);

		relatedErrors.forEach((error) => {
			const { donorId } = donor;
			const { errorType, message, fieldName } = error;
			const relatedErrorGroup = tableErrorGroups.find(
				(tableErrorGroup) =>
					tableErrorGroup[0].errorType === errorType &&
					tableErrorGroup[0].message === message &&
					tableErrorGroup[0].fieldName === fieldName,
			);
			const tableError = { ...error, donorId };

			if (!relatedErrorGroup) {
				tableErrorGroups.push([tableError]);
			} else {
				relatedErrorGroup.push(tableError);
			}
		});
	});

	const tableErrors = tableErrorGroups.map((errorGroup) => {
		// Counts Number of Records affected for each Error Object
		const { fieldName, entityName, message, errorType } = errorGroup[0];

		const errorMessage =
			errorType === 'UNRECOGNIZED_FIELD'
				? `${fieldName} is not a field within the latest dictionary. Please remove this from the ${entityName}.tsv file before submitting.`
				: message;

		const entries = errorGroup.length;

		return {
			entries,
			fieldName,
			entityName,
			errorMessage,
		};
	});

	const totalErrors = tableErrors.reduce(
		(errorCount, errorGroup) => errorCount + errorGroup.entries,
		0,
	);
	const hasErrors = totalErrors > 0;

	const sortEntityData = (prev, next) => {
		let sortVal = 0;

		if (hasErrors) {
			// If Current Entity has Errors, Prioritize Data w/ Errors
			const { errorsA, errorsB } = clinicalErrors.reduce(
				(acc, current) => {
					if (current.donorId == prev['donor_id']) {
						acc.errorsA = -1;
					}
					if (current.donorId == next['donor_id']) {
						acc.errorsB = 1;
					}
					return acc;
				},
				{ errorsA: 0, errorsB: 0 },
			);

			sortVal += errorsA + errorsB;
		}

		// Handles Manual User Sorting by Core Completion columns
		const completionSortIndex = completionKeys.indexOf(sortKey);

		if (completionSortIndex) {
			const completionSortKey = completionColumnNames[completionSortIndex];
			const completionA = prev[completionSortKey];
			const completionB = next[completionSortKey];

			sortVal = completionA === completionB ? 0 : completionA > completionB ? -1 : 1;
			sortVal *= desc ? -1 : 1;
		}

		return sortVal;
	};

	// Map Completion Stats + Entity Data
	if (noTableData) {
		showCompletionStats = true;
		records = noDataCompletionStats;
	} else {
		const entityData = clinicalData.clinicalEntities.find(
			(entity) => entity.entityName === aliasedEntityNames[entityType],
		);
		columns = [...entityData.entityFields];
		const { completionStats, entityName } = entityData;
		showCompletionStats = !!(completionStats && entityName === aliasedEntityNames.donor);

		// totalDocs affects pagination and display text
		// If using default query, or using search but not filtering by donor in URL, then we display total number of search results
		// Else we use the total number of results that match our query
		totalDocs =
			(useDefaultQuery && entityType === 'donor') ||
			(!currentDonors.length && totalResults > entityData.totalDocs)
				? totalResults
				: entityData.totalDocs;

		entityData.records.forEach((record) => {
			record.forEach((r) => {
				if (!columns.includes(r.name)) columns.push(r.name);
			});
		});
		if (showCompletionStats) {
			columns.splice(1, 0, ...Object.values(completionColumnHeaders));
		}

		records = entityData.records
			.map((record) => {
				let clinicalRecord = {};
				record.forEach((r) => {
					const displayKey = r.name;
					clinicalRecord[displayKey] = displayKey === 'donor_id' ? `DO${r.value}` : r.value || '';
					if (showCompletionStats && displayKey === 'donor_id') {
						const completionRecord = completionStats.find(
							(stat) => stat.donorId === parseInt(r.value),
						);

						if (!completionRecord) {
							clinicalRecord = { ...clinicalRecord, ...emptyCompletion };
						} else {
							const {
								coreCompletion,
								entityData: completionEntityData,
								hasMissingEntityException,
							} = completionRecord;

							clinicalRecord['hasMissingEntityException'] = hasMissingEntityException;

							coreCompletionFields.forEach((field) => {
								const completionField = completionColumnHeaders[field];
								const isSpecimenField =
									completionField === completionColumnHeaders['normalSpecimens'] ||
									completionField === completionColumnHeaders['tumourSpecimens'];

								if (!isSpecimenField) {
									const completionValue = coreCompletion[field];
									clinicalRecord[completionField] = completionValue || 0;
								} else {
									const {
										specimens: {
											coreCompletionPercentage,
											normalSpecimensPercentage,
											tumourSpecimensPercentage,
											normalSubmissions,
											tumourSubmissions,
										},
									} = completionEntityData;

									if (coreCompletionPercentage === 1) {
										clinicalRecord[completionField] = 1;
									} else {
										const currentPercentage =
											completionField === completionColumnHeaders['normalSpecimens']
												? normalSpecimensPercentage
												: tumourSpecimensPercentage;
										const currentSubmissions =
											completionField === completionColumnHeaders['normalSpecimens']
												? normalSubmissions
												: tumourSubmissions;
										const hasErrors = currentPercentage !== 1;
										const value = hasErrors ? currentSubmissions : currentPercentage;
										clinicalRecord[completionField] = value;
									}
								}
							});
						}
					}
				});

				return clinicalRecord;
			})
			.sort(sortEntityData);
	}

	const getHeaderBorder = (key) =>
		(showCompletionStats && key === completionColumnHeaders.followUps) ||
		(!showCompletionStats && key === 'donor_id') ||
		key === 'FO'
			? styleThickBorder
			: '';

	const [stickyDonorIDColumnsWidth, setStickyDonorIDColumnsWidth] = useState(74);

	const getCellStyles = (state, row, column) => {
		const { original } = row;
		const { id } = column;
		const isCompletionCell =
			showCompletionStats && Object.values(completionColumnHeaders).includes(id);

		const isSpecimenCell =
			isCompletionCell &&
			(id === completionColumnHeaders.normalSpecimens ||
				id === completionColumnHeaders.tumourSpecimens);

		const originalDonorId = original['donor_id'];
		const cellDonorId = parseInt(
			originalDonorId && originalDonorId.includes('DO')
				? originalDonorId.substring(2)
				: originalDonorId,
		);

		const donorErrorData = clinicalErrors
			.filter((donor) => donor.donorId === cellDonorId)
			.map((donor) => donor.errors)
			.flat();

		const columnErrorData =
			donorErrorData.length &&
			donorErrorData.filter(
				(error) =>
					error &&
					(error.entityName === entityType ||
						(aliasedEntityFields.includes(error.entityName) &&
							aliasedEntityNames[entityType] === error.entityName)) &&
					error.fieldName === id,
			);

		const hasClinicalErrors = columnErrorData && columnErrorData.length >= 1;

		let hasCompletionErrors = isCompletionCell && original[id] !== 1;

		if (isSpecimenCell) {
			const completionData = clinicalData.clinicalEntities.find(
				(entity) => entity.entityName === aliasedEntityNames['donor'],
			).completionStats;

			const completionRecord =
				isCompletionCell &&
				completionData.find((stat) => stat.donorId === parseInt(originalDonorId.substr(2)));

			if (completionRecord) {
				const { entityData: completionEntityData } = completionRecord;

				const {
					specimens: { normalSpecimensPercentage, tumourSpecimensPercentage },
				} = completionEntityData;

				const currentPercentage =
					id === completionColumnHeaders['normalSpecimens']
						? normalSpecimensPercentage
						: tumourSpecimensPercentage;

				hasCompletionErrors = currentPercentage !== 1;
			}
		}

		const specificErrorValue =
			hasClinicalErrors &&
			columnErrorData.filter(
				(error) =>
					(error.errorType === 'INVALID_BY_SCRIPT' || error.errorType === 'INVALID_ENUM_VALUE') &&
					(error.info?.value === original[id] ||
						(error.info?.value && error.info.value[0] === original[id]) ||
						(error.info.value === null && !Boolean(original[id]))),
			);

		const fieldError =
			hasClinicalErrors &&
			columnErrorData.filter(
				(error) =>
					(error.errorType === 'UNRECOGNIZED_FIELD' ||
						error.errorType === 'MISSING_REQUIRED_FIELD') &&
					error.fieldName === id,
			);

		const errorState =
			// Completion Stats === 1 indicates Complete
			// 0 is Incomplete, <1 Incorrect Sample / Specimen Ratio
			(isCompletionCell && hasCompletionErrors) ||
			specificErrorValue?.length > 0 ||
			fieldError?.length > 0;

		// use Emotion styling
		const headerDonorIdStyle = css`
			background: white,
			position: absolute,
		`;
		const stickyMarginStyle = css`
			margin-left: ${stickyDonorIDColumnsWidth};
		`;
		const style = css`
			color: ${isCompletionCell && !errorState && theme.colors.accent1_dark};
			background: ${errorState && !original.hasMissingEntityException && theme.colors.error_4};
			${getHeaderBorder(id)}
			${column.Header === 'donor_id' && headerDonorIdStyle};
			${column.Header === 'DO' && stickyMarginStyle};
			${column.Header === 'program_id' && !showCompletionStats && stickyMarginStyle};
		`;

		return {
			style,
			isCompletionCell,
			errorState,
		};
	};

	columns = columns.map((key) => {
		return {
			id: key,
			accessorKey: key,
			Header: key,
			minWidth: getColumnWidth(key, showCompletionStats, noTableData),
		};
	});

	if (showCompletionStats) {
		columns = [
			{
				id: 'clinical_core_completion_header',
				meta: { customHeader: true },
				sortingFn: sortEntityData,
				header: () => <ClinicalCoreCompletionHeader />,

				columns: columns.slice(0, 7).map((column, index) => ({
					...column,
					sortingFn: sortEntityData,
					header: (props) => {
						const value = props.header.id;
						const coreCompletionColumnsCount = 7;
						const isLastElement = index === coreCompletionColumnsCount - 1;
						const isSticky = value === 'donor_id';
						const isSorted = props.sorted;

						return <Cell config={{ isLastElement, isSorted, isSticky }}>{value}</Cell>;
					},
					meta: { customCell: true, customHeader: true },
					cell: (context) => {
						const value = context.getValue();
						const isSticky = context.column.id === 'donor_id';

						const { isCompletionCell, errorState, style } = getCellStyles(
							undefined,
							context.row,
							context.column,
						);

						const showSuccessSvg = isCompletionCell && !errorState;
						const { hasMissingEntityException } = context.row.original;
						const colId = context.column.id;
						const showMissingEntitySymbol =
							hasMissingEntityException &&
							[completionColumnHeaders.treatments, completionColumnHeaders.followUps].includes(
								colId,
							);

						const content = showMissingEntitySymbol ? (
							<div>{DashIcon}</div>
						) : showSuccessSvg ? (
							<Icon name="checkmark" fill="accent1_dimmed" width="12px" height="12px" />
						) : (
							value
						);

						return (
							<Cell config={{ isSticky }} styles={[style]}>
								{content}
							</Cell>
						);
					},
				})),
			},
			{
				id: 'submitted_donor_data_header',
				meta: { customHeader: true },
				header: () => (
					<TopLevelHeader
						title="SUBMITTED DONOR DATA"
						styles={[
							css`
								text-align: left;
							`,
						]}
					/>
				),
				columns: columns.slice(7),
			},
		];
	}

	const tableMin = totalDocs > 0 ? page * pageSize + 1 : totalDocs;
	const tableMax = totalDocs < (page + 1) * pageSize ? totalDocs : (page + 1) * pageSize;
	const numTablePages = Math.ceil(totalDocs / pageSize);
	const numErrorPages = Math.ceil(totalErrors / errorPageSize);

	return loading ? (
		<DnaLoader
			css={css`
				display: flex;
				justify-content: center;
				width: 100%;
			`}
		/>
	) : noTableData ? (
		<NoDataCell />
	) : (
		<div
			ref={containerRef}
			css={css`
				position: relative;
			`}
		>
			{hasErrors && (
				<div
					id="error-submission-workspace"
					css={css`
						margin: 12px 0px;
					`}
				>
					<ErrorNotification
						level={NOTIFICATION_VARIANTS.ERROR}
						title={`${totalErrors.toLocaleString()} error(s) found on the current page of ${clinicalEntityDisplayNames[
							entityType
						].toLowerCase()} table`}
						subtitle={<Subtitle program={program} />}
						errors={tableErrors}
						columnConfig={errorColumns}
						tableProps={{
							page: errorPage,
							pages: numErrorPages,
							pageSize: errorPageSize,
							sorted: errorSorted,
							onPageChange: (value) => updatePageSettings('page', value),
							onPageSizeChange: (value) => updatePageSettings('pageSize', value),
							onSortedChange: (value) => updatePageSettings('sorted', value),
							// TODO: Test + Update Pagination in #2267
							// https://github.com/icgc-argo/platform-ui/issues/2267
							showPagination: false,
						}}
					/>
				</div>
			)}

			<TableInfoHeaderContainer
				left={
					<Typography
						css={css`
							margin: 0px;
						`}
						variant="data"
					>
						Showing {tableMin} - {tableMax} of {totalDocs} records
					</Typography>
				}
			/>
			<Table
				data={records}
				columns={columns}
				withHeaders
				withSideBorders
				withPagination
				showPageSizeOptions
				withStripes
				enableColumnResizing={false}
				enableSorting
			/>
		</div>
	);
};

export default ClinicalEntityDataTable;
