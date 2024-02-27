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

import { TableInfoHeaderContainer } from '@/app/components/Table/common';
import { Icon, Table, Typography, css, useTheme } from '@icgc-argo/uikit';
import memoize from 'lodash/memoize';
import { createRef, useState } from 'react';
import {
	Cell,
	ClinicalCoreCompletionHeader,
	TopLevelHeader,
	styleThickBorder,
} from '../ClinicalDataTableComp';
import { aliasedEntityFields, aliasedEntityNames } from '../common';

export type DonorEntry = {
	row: string;
	isNew: boolean;
	[k: string]: string | number | boolean;
};

const emptyCompletion = {
	DO: 0,
	PD: 0,
	FO: 0,
	NS: 0,
	TR: 0,
	TS: 0,
};

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

type ClinicalEntityDataTableProps = {
	entityType: string;
	currentDonors: number[];
	useDefaultQuery: boolean;
	page;
	pageSize;
	clinicalData: any;
	clinicalErrors: any;
	sortingFn: any;
};
const ClinicalEntityDataTable = ({
	entityType,
	currentDonors,
	useDefaultQuery,
	page,
	pageSize,
	clinicalData,
	clinicalErrors,
	sortingFn,
}: ClinicalEntityDataTableProps) => {
	const theme = useTheme();
	const containerRef = createRef<HTMLDivElement>();

	// Init + Page Settings
	let totalDocs = 0;
	let showCompletionStats = false;
	let records = [];
	let columns = [];

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
						const { coreCompletion, entityData: completionEntityData } = completionRecord;

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
		.sort(sortingFn);

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
			background: ${errorState && theme.colors.error_4};
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
				sortingFn,
				header: () => <ClinicalCoreCompletionHeader />,

				columns: columns.slice(0, 7).map((column, index) => ({
					...column,
					sortingFn,
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

						const content = showSuccessSvg ? (
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

	return (
		<div
			ref={containerRef}
			css={css`
				position: relative;
			`}
		>
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
