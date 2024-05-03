/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import {
	ClinicalEntitySearchResultsQuery,
	ClinicalSearchResults,
} from '@/__generated__/clinical/graphql';
import ErrorNotification from '@/components/ErrorNotification';
import { TableInfoHeaderContainer } from '@/components/Table/common';
import { css, useTheme } from '@/lib/emotion';
import { DnaLoader, Icon, NOTIFICATION_VARIANTS, Table, Typography } from '@icgc-argo/uikit';
import { createRef, useEffect, useState } from 'react';
import {
	Cell,
	ClinicalCoreCompletionHeader,
	TopLevelHeader,
	styleThickBorder,
} from '../ClinicalDataTableComp';
import {
	ClinicalEntitySearchResultResponse,
	CompletionStates,
	aliasSortNames,
	aliasedEntityFields,
	aliasedEntityNames,
	clinicalEntityDisplayNames,
	emptyClinicalDataResponse,
	emptySearchResponse,
} from '../common';
import { DashIcon, NoDataCell, Subtitle } from './components';
import { useGetEntityData } from './dataQuery';
import {
	completionColumnHeaders,
	completionColumnNames,
	completionKeys,
	coreCompletionFields,
	defaultDonorSettings,
	defaultEntityPageSettings,
	defaultErrorPageSettings,
	emptyCompletion,
	errorColumns,
} from './tableConfig';
import { getColumnWidth } from './util';

const getTableErrors = (
	clinicalErrors,
	entityType,
): [{ entries: any[]; fieldName: any; entityName: string; errorMessage: string }[], number] => {
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

	const totalErrorCount = tableErrors.reduce(
		(errorCount, errorGroup) => errorCount + errorGroup.entries,
		0,
	);

	return [tableErrors, totalErrorCount];
};

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
	donorSearchResults: ClinicalEntitySearchResultsQuery | ClinicalEntitySearchResultResponse;
	useDefaultQuery: boolean;
	noData: boolean;
}) => {
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
		clinicalEntityData === undefined || loading
			? emptyClinicalDataResponse(program)
			: clinicalEntityData;

	const noTableData = noData || clinicalData.clinicalEntities.length === 0;

	const [stickyDonorIDColumnsWidth, setStickyDonorIDColumnsWidth] = useState(74);

	if (loading) {
		return (
			<DnaLoader
				css={css`
					display: flex;
					justify-content: center;
					width: 100%;
				`}
			/>
		);
	} else if (noTableData) {
		return <NoDataCell />;
	} else {
		// Init + Page Settings
		let totalDocs = 0;
		let showCompletionStats = false;
		let records = [];
		let columns = [];

		// Collect Error Data
		const { clinicalErrors = [] } = clinicalData;

		const [tableErrors, totalErrorCount] = getTableErrors(clinicalErrors, entityType);

		const hasErrors = totalErrorCount > 0;

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

		const getHeaderBorder = (key) => {
			return (showCompletionStats && key === completionColumnHeaders.followUps) ||
				(!showCompletionStats && key === 'donor_id') ||
				key === 'FO'
				? styleThickBorder
				: '';
		};

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
		const numErrorPages = Math.ceil(totalErrorCount / errorPageSize);

		return (
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
							title={`${totalErrorCount.toLocaleString()} error(s) found on the current page of ${clinicalEntityDisplayNames[
								entityType
							].toLowerCase()} table`}
							subtitle={<Subtitle program={program} />}
							reportData={tableErrors}
							reportColumns={errorColumns}
							tableProps={{
								page: errorPage,
								pages: numErrorPages,
								pageSize: errorPageSize,
								sorted: errorSorted,
								onPageChange: (value) => updatePageSettings('page', value),
								onPageSizeChange: (value) => updatePageSettings('pageSize', value),
								onSortedChange: (value) => updatePageSettings('sorted', value),
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
	}
};

export default ClinicalEntityDataTable;
