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

import { DonorSummaryEntry } from '@/__generated__/gateway/graphql';
import { CellContentCenter, DataTableStarIcon as StarIcon } from '@/components/Table/common';
import { ContentError } from '@/components/placeholders';
import { displayDate, parseDonorIdString } from '@/global/utils';
import CLINICAL_ERRORS_QUERY from '@/gql/clinical/CLINICAL_ERRORS_QUERY';
import { useClinicalQuery } from '@/hooks';
import { css } from '@/lib/emotion';
import {
	ColumnDef,
	DEFAULT_TABLE_PAGE_SIZE,
	FilterClearButton,
	Icon,
	Link,
	OnChangeFn,
	PaginationState,
	Row,
	SortingState,
	Table,
	TableHeaderWithBackground,
	TableListFilterHeader,
	TableTextFilterHeader,
	ThemeColorNames,
	useTableTabs,
	useTheme,
} from '@icgc-argo/uikit';
import { find } from 'lodash';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import urlJoin from 'url-join';
import { defaultClinicalEntityFilters } from '../../../clinical-data/common';
import { Pipeline } from '../Pipeline';
import { DesignationCell } from './DesignationCell';
import DonorSummaryTableLegend from './DonorSummaryTableLegend';
import {
	EMPTY_PROGRAM_SUMMARY_STATS,
	FILTER_OPTIONS,
	RELEASED_STATE_FILL_COLOURS,
	RELEASED_STATE_STROKE_COLOURS,
	formatDonorSummarySortingRequest,
} from './common';
import { useProgramDonorsSummaryQuery } from './queries/useProgramDonorsSummaryQuery';
import {
	DonorDataReleaseState,
	DonorSummaryCellProps,
	DonorSummaryEntrySortField,
	DonorSummaryFilterState,
	DonorSummarySortingState,
	ProgramDonorSummaryEntryField,
} from './types';

type DonorSummaryEntryFields = keyof DonorSummaryEntry;
type DonorSummaryMultiSortColumnIds = {
	[k in DonorSummaryEntryFields]: DonorSummaryEntryFields[];
};

enum PipelineNames {
	DNA = 'DNA',
	RNA = 'RNA',
}

const PIPELINE_COLORS: { [k: string]: keyof ThemeColorNames } = {
	[PipelineNames.DNA]: 'warning_4',
	[PipelineNames.RNA]: 'accent3_4',
};

// these are used to sort columns with multiple fields.
// the order of the fields is the order of sorting.
const multiSortColumnIds: Partial<DonorSummaryMultiSortColumnIds> = {
	alignmentsCompleted: ['alignmentsRunning', 'alignmentsFailed'],
	mutectCompleted: ['mutectRunning', 'mutectFailed'],
	openAccessCompleted: ['openAccessRunning', 'openAccessFailed'],
	publishedNormalAnalysis: ['publishedTumourAnalysis'],
	registeredNormalSamples: ['registeredTumourSamples'],
	rnaAlignmentsCompleted: ['rnaAlignmentsRunning', 'rnaAlignmentFailed'],
	rnaPublishedNormalAnalysis: ['rnaPublishedTumourAnalysis'],
	rnaRegisteredNormalSamples: ['rnaRegisteredTumourSamples'],
	sangerVcsCompleted: ['sangerVcsRunning', 'sangerVcsFailed'],
};
const setupMultiSort = (columnId: DonorSummaryEntryFields) => ({
	// use ID to get multiple fields from multiSortColumnIds for multi-sorting in onSortingChange
	// must have accessorKey in the column definition to enable sorting.
	// ID & accessorKey must be identical keys from the data, in order to
	// show the blue sorting indicator in the table.
	accessorKey: columnId,
	id: columnId,
});

const DonorSummaryTable = ({
	initialSorting,
	isCardLoading = true,
	programShortName,
}: {
	initialSorting: DonorSummarySortingState[];
	isCardLoading?: boolean;
	programShortName: string;
}) => {
	// config
	const theme = useTheme();

	// tabs
	const { activeTableTab: activePipeline, handleActiveTableTab: handleActivePipeline } =
		useTableTabs(PipelineNames.DNA);

	// pagination
	const [{ pageIndex, pageSize }, setPaginationState] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: DEFAULT_TABLE_PAGE_SIZE,
	});
	const handlePaginationState = (nextState: Partial<PaginationState>) =>
		setPaginationState({ pageIndex, pageSize, ...nextState });

	// sorting
	const [sortingState, setSortingState] = useState<DonorSummarySortingState[]>(initialSorting);
	const onSortingChange: OnChangeFn<SortingState> = async (
		getSorts: () => DonorSummarySortingState[],
	) => {
		const newSort = getSorts();
		const sorts = newSort.reduce(
			(accSorts: Array<DonorSummarySortingState>, sortRule: DonorSummarySortingState) => {
				const fields = [sortRule.id, ...(multiSortColumnIds[sortRule.id] || [])];
				const nextSorts = fields.map((field: DonorSummaryEntrySortField) => {
					const currentState = find(sortingState, { id: field });
					const currentDesc = currentState ? currentState.desc : sortRule.desc;
					return {
						id: field,
						desc: !currentDesc,
					};
				});

				return [...accSorts, ...nextSorts];
			},
			[],
		);
		handlePaginationState({ pageIndex: 0 });
		setSortingState(sorts);
	};

	// filtering
	const [filterState, setFilterState] = useState<DonorSummaryFilterState[]>([]);
	const handleFilterStateChange = (filters: DonorSummaryFilterState[]) => {
		setFilterState(filters);
		handlePaginationState({ pageIndex: 0 });
	};
	const updateFilter = ({ field, values }: DonorSummaryFilterState) => {
		const newFilters = filterState.filter((filter) => filter.field !== field);
		if (values.length) {
			newFilters.push({
				field,
				values: [].concat(values),
			});
		}
		handleFilterStateChange(newFilters);
	};
	const clearFilter = (field: ProgramDonorSummaryEntryField) => {
		const newFilters = filterState.filter((x) => x.field !== field);
		handleFilterStateChange(newFilters);
	};
	const getFilterValue = (field: ProgramDonorSummaryEntryField) =>
		filterState.find((x) => x.field === field)?.values;

	// query
	const [isTableLoading, setIsTableLoading] = useState<boolean>(isCardLoading);
	const {
		data: {
			programDonorSummary: { entries: programDonorSummaryEntries, stats: programDonorSummaryStats },
		} = {
			programDonorSummary: {
				entries: [],
				stats: EMPTY_PROGRAM_SUMMARY_STATS,
			},
		},
		error: programDonorsSummaryQueryError,
		loading: programDonorsSummaryQueryLoading,
	} = useProgramDonorsSummaryQuery({
		programShortName,
		first: pageSize,
		offset: pageSize * pageIndex,
		sorts: formatDonorSummarySortingRequest(sortingState),
		filters: filterState,
		options: {
			onCompleted: (result) => {
				const totalDonors = result.programDonorSummary?.stats?.registeredDonorsCount || 0;
				const nextPageCount = Math.ceil(totalDonors / pageSize);
				handlePaginationState({
					// stay on current page, unless that page is no longer available
					pageIndex: pageIndex < nextPageCount ? pageIndex : 0,
				});
				setTimeout(() => {
					setIsTableLoading(false);
				}, 500);
			},
		},
	});

	useEffect(() => {
		if (programDonorsSummaryQueryLoading) {
			setIsTableLoading(true);
		}
	}, [programDonorsSummaryQueryLoading]);

	// custom components
	const StatusColumnCell = ({ row: { original } }) => {
		return (
			<CellContentCenter>
				{original.validWithCurrentDictionary ? (
					<StarIcon
						fill={RELEASED_STATE_FILL_COLOURS[original.releaseStatus]}
						outline={RELEASED_STATE_STROKE_COLOURS[original.releaseStatus]}
					/>
				) : (
					<Icon name="warning" fill={theme.colors.error} width="16px" height="15px" />
				)}
			</CellContentCenter>
		);
	};

	const PercentageCell = ({
		original,
		fieldName,
	}: {
		original: any;
		fieldName: 'submittedCoreDataPercent' | 'submittedExtendedDataPercent';
	}) => {
		// original[fieldName] value is expected to be a fraction in decimal form
		const percentageVal = Math.round(original[fieldName] * 100);
		const cellContent =
			percentageVal === 100 ? (
				<Icon name="checkmark" fill="accent1_dimmed" width="12px" height="12px" />
			) : percentageVal === 0 ? (
				''
			) : (
				`${percentageVal}%`
			);
		return (
			<div
				css={css`
					padding-left: 4px;
				`}
			>
				{cellContent}
			</div>
		);
	};

	const donorsWithErrors = programDonorSummaryEntries
		.filter((entry) => !entry.validWithCurrentDictionary)
		.map((entry) => {
			const { donorId } = entry;
			const ID = parseDonorIdString(donorId);
			return ID;
		});

	// Search Result Query
	const { data: clinicalErrorData, loading: errorDataLoading } = useClinicalQuery(
		CLINICAL_ERRORS_QUERY,
		{
			errorPolicy: 'all',
			variables: {
				programShortName,
				filters: {
					...defaultClinicalEntityFilters,
					donorIds: donorsWithErrors,
				},
			},
		},
	);

	const errorLinkData = clinicalErrorData
		? donorsWithErrors.map((donorId) => {
				const currentDonor = clinicalErrorData.clinicalData.clinicalErrors.find(
					(donor) => donorId === donor.donorId,
				);
				const entity = currentDonor?.errors[0].entityName;
				return { donorId, entity };
		  })
		: [];

	// table info
	const tableColumns: ColumnDef<DonorSummaryEntry>[] = [
		{
			header: () => (
				<TableHeaderWithBackground fill="secondary_4">
					Clinical Data Status
				</TableHeaderWithBackground>
			),
			id: 'clinicalDataStatus',
			meta: {
				customHeader: true,
			},
			columns: [
				{
					header: () => (
						<CellContentCenter>
							<StarIcon fill={'grey_1'} />
						</CellContentCenter>
					),
					cell: StatusColumnCell,
					accessorKey: 'releaseStatus',
					size: 50,
					enableResizing: false,
					sortingFn: (rowA: Row<DonorSummaryEntry>, rowB: Row<DonorSummaryEntry>) => {
						const priorities: { [k in DonorDataReleaseState]: number } = {
							[DonorDataReleaseState.NO]: 1,
							[DonorDataReleaseState.PARTIALLY]: 2,
							[DonorDataReleaseState.FULLY]: 3,
						};
						return (
							priorities[rowA.original.releaseStatus] - priorities[rowB.original.releaseStatus]
						);
					},
				},
				{
					header: () => (
						<TableTextFilterHeader
							header={'Donor ID'}
							onFilter={(text) =>
								text?.length
									? updateFilter({
											field: 'combinedDonorId',
											values: [].concat(text),
									  })
									: clearFilter('combinedDonorId')
							}
							filterValue={getFilterValue('combinedDonorId')}
						/>
					),
					accessorKey: 'donorId',
					cell: ({ row: { original } }: DonorSummaryCellProps) => {
						const errorTab =
							errorLinkData.find((error) => error.donorId === parseDonorIdString(original.donorId))
								?.entity || '';

						const linkUrl = urlJoin(
							`/submission/program/`,
							programShortName,
							`/clinical-data/?donorId=${original.donorId}&tab=${errorTab || 'donor'}`,
						);

						return (
							<NextLink href={linkUrl}>
								<Link>{`${original.donorId} (${original.submitterDonorId})`}</Link>
							</NextLink>
						);
					},
					size: 135,
				},
				{
					header: () => (
						<TableListFilterHeader
							header={'Core Completion'}
							panelLegend={'Core Completion Status'}
							onFilter={(options) =>
								updateFilter({
									field: 'coreDataPercentAggregation',
									values: options.filter((option) => option.isChecked).map((option) => option.key),
								})
							}
							filterOptions={FILTER_OPTIONS.completeIncomplete}
							filterCounts={{
								[FILTER_OPTIONS.completeIncomplete[0].key]:
									programDonorSummaryStats?.coreCompletion?.completed,
								[FILTER_OPTIONS.completeIncomplete[1].key]:
									programDonorSummaryStats?.coreCompletion?.incomplete,
								[FILTER_OPTIONS.completeIncomplete[2].key]:
									programDonorSummaryStats?.coreCompletion?.noData,
							}}
							activeFilters={getFilterValue('coreDataPercentAggregation')}
						/>
					),
					accessorKey: 'submittedCoreDataPercent',
					cell: ({ row: { original } }) => (
						<PercentageCell original={original} fieldName="submittedCoreDataPercent" />
					),
					size: 95,
				},
			],
		},
		{
			header: () => (
				<TableHeaderWithBackground
					fill={PIPELINE_COLORS[PipelineNames[activePipeline]] as keyof ThemeColorNames}
				>
					{`${activePipeline}-SEQ PIPELINE`}
				</TableHeaderWithBackground>
			),
			id: 'dnaRnaSeqPipeline',
			meta: {
				customHeader: true,
				columnTabs: {
					activeTab: activePipeline,
					handleTabs: handleActivePipeline,
					tabs: [
						{
							label: 'DNA-SEQ',
							value: PipelineNames.DNA,
							color: theme.colors[PIPELINE_COLORS[PipelineNames.DNA]],
						},
						{
							label: 'RNA-SEQ',
							value: PipelineNames.RNA,
							color: theme.colors[PIPELINE_COLORS[PipelineNames.RNA]],
						},
					],
				},
			},
			columns: [
				...(activePipeline === PipelineNames.DNA
					? [
							{
								header: () => (
									<TableListFilterHeader
										header={'Registered Samples'}
										panelLegend="DNA Registration Status"
										onFilter={(options) =>
											updateFilter({
												field: 'dnaTNRegistered',
												values: options
													.filter((option) => option.isChecked)
													.map((option) => option.key),
											})
										}
										filterOptions={FILTER_OPTIONS.tnRegisteredTnNotRegistered}
										filterCounts={{
											[FILTER_OPTIONS.tnRegisteredTnNotRegistered[0].key]:
												programDonorSummaryStats?.dnaTNRegisteredStatus?.tumorAndNormal,
											[FILTER_OPTIONS.tnRegisteredTnNotRegistered[1].key]:
												programDonorSummaryStats?.dnaTNRegisteredStatus?.tumorOrNormal,
											[FILTER_OPTIONS.tnRegisteredTnNotRegistered[2].key]:
												programDonorSummaryStats?.dnaTNRegisteredStatus?.noData,
										}}
										activeFilters={getFilterValue('dnaTNRegistered')}
									/>
								),
								meta: {
									customCell: true,
								},
								sortingFn: (rowA: Row<DonorSummaryEntry>, rowB: Row<DonorSummaryEntry>) => {
									const priorities: { [k in DonorDataReleaseState]: number } = {
										[DonorDataReleaseState.NO]: 1,
										[DonorDataReleaseState.PARTIALLY]: 2,
										[DonorDataReleaseState.FULLY]: 3,
									};
									return (
										priorities[rowA.original.releaseStatus] -
										priorities[rowB.original.releaseStatus]
									);
								},
								...setupMultiSort('registeredNormalSamples'),
								cell: ({ row: { original } }: DonorSummaryCellProps) => (
									<DesignationCell
										normalCount={original.registeredNormalSamples}
										original={original}
										tumourCount={original.registeredTumourSamples}
										type={'dnaTNRegistered'}
									/>
								),
							},
							{
								header: () => (
									<TableListFilterHeader
										header={'Raw Reads'}
										panelLegend="DNA Raw Reads Status"
										onFilter={(options) =>
											updateFilter({
												field: 'dnaTNMatchedPair',
												values: options
													.filter((option) => option.isChecked)
													.map((option) => option.key),
											})
										}
										filterOptions={FILTER_OPTIONS.tnMatchedPairSubmittedTnMatchedPairNotSubmitted}
										filterCounts={{
											[FILTER_OPTIONS.tnMatchedPairSubmittedTnMatchedPairNotSubmitted[0].key]:
												programDonorSummaryStats?.dnaTNMatchedPairStatus?.tumorNormalMatchedPair,
											[FILTER_OPTIONS.tnMatchedPairSubmittedTnMatchedPairNotSubmitted[1].key]:
												programDonorSummaryStats?.dnaTNMatchedPairStatus?.tumorNormalNoMatchedPair,
											[FILTER_OPTIONS.tnMatchedPairSubmittedTnMatchedPairNotSubmitted[2].key]:
												programDonorSummaryStats?.dnaTNMatchedPairStatus
													?.tumorNormalMatchedPairMissingRawReads,
											[FILTER_OPTIONS.tnMatchedPairSubmittedTnMatchedPairNotSubmitted[3].key]:
												programDonorSummaryStats?.dnaTNMatchedPairStatus?.noData,
										}}
										activeFilters={getFilterValue('dnaTNMatchedPair')}
									/>
								),
								meta: { customCell: true },
								...setupMultiSort('publishedNormalAnalysis'),
								cell: ({ row: { original } }) => (
									<DesignationCell
										normalCount={original.publishedNormalAnalysis}
										original={original}
										tumourCount={original.publishedTumourAnalysis}
										type={'dnaTNMatchedPair'}
									/>
								),
							},
							{
								header: () => (
									<TableListFilterHeader
										header={'Alignment'}
										panelLegend={'Alignment Status'}
										onFilter={(options) =>
											updateFilter({
												field: 'alignmentStatus',
												values: options
													.filter((option) => option.isChecked)
													.map((option) => option.key),
											})
										}
										filterOptions={FILTER_OPTIONS.completedInProgressFailed}
										filterCounts={{
											[FILTER_OPTIONS.completedInProgressFailed[0].key]:
												programDonorSummaryStats?.alignmentStatusCount?.completed,
											[FILTER_OPTIONS.completedInProgressFailed[1].key]:
												programDonorSummaryStats?.alignmentStatusCount?.inProgress,
											[FILTER_OPTIONS.completedInProgressFailed[2].key]:
												programDonorSummaryStats?.alignmentStatusCount?.failed,
											[FILTER_OPTIONS.completedInProgressFailed[3].key]:
												programDonorSummaryStats?.alignmentStatusCount?.noData,
										}}
										activeFilters={getFilterValue('alignmentStatus')}
									/>
								),
								...setupMultiSort('alignmentsCompleted'),
								cell: ({ row: { original } }) => (
									<Pipeline
										complete={original.alignmentsCompleted}
										inProgress={original.alignmentsRunning}
										error={original.alignmentsFailed}
									/>
								),
							},
							{
								header: () => (
									<TableListFilterHeader
										header={'Sanger VC'}
										panelLegend={'Sanger VC Status'}
										onFilter={(options) =>
											updateFilter({
												field: 'sangerVCStatus',
												values: options
													.filter((option) => option.isChecked)
													.map((option) => option.key),
											})
										}
										filterOptions={FILTER_OPTIONS.completedInProgressFailed}
										filterCounts={{
											[FILTER_OPTIONS.completedInProgressFailed[0].key]:
												programDonorSummaryStats?.sangerStatusCount?.completed,
											[FILTER_OPTIONS.completedInProgressFailed[1].key]:
												programDonorSummaryStats?.sangerStatusCount?.inProgress,
											[FILTER_OPTIONS.completedInProgressFailed[2].key]:
												programDonorSummaryStats?.sangerStatusCount?.failed,
											[FILTER_OPTIONS.completedInProgressFailed[3].key]:
												programDonorSummaryStats?.sangerStatusCount?.noData,
										}}
										activeFilters={getFilterValue('sangerVCStatus')}
									/>
								),
								...setupMultiSort('sangerVcsCompleted'),
								cell: ({ row: { original } }) => (
									<Pipeline
										complete={original.sangerVcsCompleted}
										inProgress={original.sangerVcsRunning}
										error={original.sangerVcsFailed}
									/>
								),
							},
							{
								header: () => (
									<TableListFilterHeader
										header={'Mutect2 VC'}
										panelLegend={'Mutect2 VC Status'}
										onFilter={(options) =>
											updateFilter({
												field: 'mutectStatus',
												values: options
													.filter((option) => option.isChecked)
													.map((option) => option.key),
											})
										}
										filterOptions={FILTER_OPTIONS.completedInProgressFailed}
										filterCounts={{
											[FILTER_OPTIONS.completedInProgressFailed[0].key]:
												programDonorSummaryStats?.mutectStatusCount?.completed,
											[FILTER_OPTIONS.completedInProgressFailed[1].key]:
												programDonorSummaryStats?.mutectStatusCount?.inProgress,
											[FILTER_OPTIONS.completedInProgressFailed[2].key]:
												programDonorSummaryStats?.mutectStatusCount?.failed,
											[FILTER_OPTIONS.completedInProgressFailed[3].key]:
												programDonorSummaryStats?.mutectStatusCount?.noData,
										}}
										activeFilters={getFilterValue('mutectStatus')}
									/>
								),
								...setupMultiSort('mutectCompleted'),
								cell: ({ row: { original } }) => (
									<Pipeline
										complete={original.mutectCompleted}
										inProgress={original.mutectRunning}
										error={original.mutectFailed}
									/>
								),
							},
							{
								header: () => (
									<TableListFilterHeader
										header={'Open Access VF'}
										panelLegend={'Open Access VF Status'}
										onFilter={(options) =>
											updateFilter({
												field: 'openAccessStatus',
												values: options
													.filter((option) => option.isChecked)
													.map((option) => option.key),
											})
										}
										filterOptions={FILTER_OPTIONS.completedInProgressFailed}
										filterCounts={{
											[FILTER_OPTIONS.completedInProgressFailed[0].key]:
												programDonorSummaryStats?.openAccessStatusCount?.completed,
											[FILTER_OPTIONS.completedInProgressFailed[1].key]:
												programDonorSummaryStats?.openAccessStatusCount?.inProgress,
											[FILTER_OPTIONS.completedInProgressFailed[2].key]:
												programDonorSummaryStats?.openAccessStatusCount?.failed,
											[FILTER_OPTIONS.completedInProgressFailed[3].key]:
												programDonorSummaryStats?.openAccessStatusCount?.noData,
										}}
										activeFilters={getFilterValue('openAccessStatus')}
									/>
								),
								...setupMultiSort('openAccessCompleted'),
								cell: ({ row: { original } }) => (
									<Pipeline
										complete={original.openAccessCompleted}
										inProgress={original.openAccessRunning}
										error={original.openAccessFailed}
									/>
								),
							},
					  ]
					: [
							{
								header: () => (
									<TableListFilterHeader
										header={'Registered Samples'}
										panelLegend={'RNA Registration Status'}
										onFilter={(options) =>
											updateFilter({
												field: 'rnaRegisteredSample',
												values: options
													.filter((option) => option.isChecked)
													.map((option) => option.key),
											})
										}
										filterOptions={FILTER_OPTIONS.samplesRegisteredNoSamplesRegistered}
										filterCounts={{
											[FILTER_OPTIONS.samplesRegisteredNoSamplesRegistered[0].key]:
												programDonorSummaryStats?.rnaSampleStatus?.dataSubmitted,
											[FILTER_OPTIONS.samplesRegisteredNoSamplesRegistered[1].key]:
												programDonorSummaryStats?.rnaSampleStatus?.noDataSubmitted,
										}}
										activeFilters={getFilterValue('rnaRegisteredSample')}
									/>
								),
								meta: { customCell: true },
								...setupMultiSort('rnaRegisteredNormalSamples'),
								cell: ({ row: { original } }) => (
									<DesignationCell
										normalCount={original.rnaRegisteredNormalSamples}
										tumourCount={original.rnaRegisteredTumourSamples}
									/>
								),
							},
							{
								header: () => (
									<TableListFilterHeader
										header={'Raw Reads'}
										panelLegend={'RNA Raw Reads Status'}
										onFilter={(options) =>
											updateFilter({
												field: 'rnaRawReads',
												values: options
													.filter((option) => option.isChecked)
													.map((option) => option.key),
											})
										}
										filterOptions={FILTER_OPTIONS.dataSubmittedNoData}
										filterCounts={{
											[FILTER_OPTIONS.dataSubmittedNoData[0].key]:
												programDonorSummaryStats?.rnaRawReadStatus?.dataSubmitted,
											[FILTER_OPTIONS.dataSubmittedNoData[1].key]:
												programDonorSummaryStats?.rnaRawReadStatus?.noDataSubmitted,
										}}
										activeFilters={getFilterValue('rnaRawReads')}
									/>
								),
								meta: { customCell: true },
								...setupMultiSort('rnaPublishedNormalAnalysis'),
								cell: ({ row: { original } }) => (
									<DesignationCell
										normalCount={original.rnaPublishedNormalAnalysis}
										tumourCount={original.rnaPublishedTumourAnalysis}
									/>
								),
							},
							{
								header: () => (
									<TableListFilterHeader
										header={'Alignment'}
										panelLegend={'Alignment Status'}
										onFilter={(options) =>
											updateFilter({
												field: 'rnaAlignmentStatus',
												values: options
													.filter((option) => option.isChecked)
													.map((option) => option.key),
											})
										}
										filterOptions={FILTER_OPTIONS.completedInProgressFailed}
										filterCounts={{
											[FILTER_OPTIONS.completedInProgressFailed[0].key]:
												programDonorSummaryStats?.rnaAlignmentStatusCount?.completed,
											[FILTER_OPTIONS.completedInProgressFailed[1].key]:
												programDonorSummaryStats?.rnaAlignmentStatusCount?.inProgress,
											[FILTER_OPTIONS.completedInProgressFailed[2].key]:
												programDonorSummaryStats?.rnaAlignmentStatusCount?.failed,
											[FILTER_OPTIONS.completedInProgressFailed[3].key]:
												programDonorSummaryStats?.rnaAlignmentStatusCount?.noData,
										}}
										activeFilters={getFilterValue('rnaAlignmentStatus')}
									/>
								),
								...setupMultiSort('rnaAlignmentsCompleted'),
								cell: ({ row: { original } }) => (
									<Pipeline
										complete={original.rnaAlignmentsCompleted}
										inProgress={original.rnaAlignmentsRunning}
										error={original.rnaAlignmentFailed}
									/>
								),
							},
					  ]),
			],
		},
		{
			header: () =>
				filterState.length ? (
					<FilterClearButton
						size="sm"
						variant="text"
						type="button"
						onClick={() => handleFilterStateChange([])}
					>
						Clear Filters
					</FilterClearButton>
				) : (
					<></>
				),
			id: 'updated',
			columns: [
				{
					header: () => (
						<TableListFilterHeader
							header={'Alerts'}
							panelLegend={'Filter Alerts'}
							onFilter={(options) =>
								updateFilter({
									field: 'validWithCurrentDictionary',
									values: options.filter((option) => option.isChecked).map((option) => option.key),
								})
							}
							filterOptions={FILTER_OPTIONS.validWithCurrentDictionary}
							filterCounts={{
								[FILTER_OPTIONS.validWithCurrentDictionary[0].key]:
									programDonorSummaryStats?.donorsInvalidWithCurrentDictionaryCount || 0,
								[FILTER_OPTIONS.validWithCurrentDictionary[1].key]:
									programDonorSummaryStats?.registeredDonorsCount -
										programDonorSummaryStats?.donorsInvalidWithCurrentDictionaryCount || 0,
							}}
							activeFilters={getFilterValue('validWithCurrentDictionary')}
						/>
					),
					accessorKey: 'validWithCurrentDictionary',
					cell: ({ row: { original } }) => {
						const errorTab =
							errorLinkData.find((error) => error.donorId === parseDonorIdString(original.donorId))
								?.entity || '';

						const linkUrl = urlJoin(
							`/submission/program/`,
							programShortName,
							`/clinical-data/?donorId=${original.donorId}`,
							errorTab && `&tab=${errorTab}`,
						);

						return original.validWithCurrentDictionary ? (
							''
						) : (
							<NextLink href={linkUrl}>
								<Link>
									<Icon name="warning" fill={theme.colors.error} width="16px" height="15px" />{' '}
									Update Clinical
								</Link>
							</NextLink>
						);
					},
					size: 125,
				},
				{
					header: 'Last Updated',
					accessorKey: 'updatedAt',
					cell: ({ row: { original } }: DonorSummaryCellProps) => {
						return <div>{displayDate(original.updatedAt)}</div>;
					},
					size: 95,
				},
			].filter(Boolean),
		},
	];

	return (
		<div
			css={css`
				padding-top: 10px;
			`}
		>
			{programDonorsSummaryQueryError ? (
				<ContentError />
			) : (
				<>
					<DonorSummaryTableLegend
						css={css`
							opacity: ${isTableLoading ? 0.5 : 1};
						`}
						programDonorSummaryStats={programDonorSummaryStats}
					/>
					<Table
						columns={tableColumns}
						data={programDonorSummaryEntries}
						enableSorting
						loading={isCardLoading || isTableLoading}
						manualPagination
						manualSorting
						onPaginationChange={setPaginationState}
						onSortingChange={onSortingChange}
						pageCount={Math.ceil((programDonorSummaryStats.registeredDonorsCount || 0) / pageSize)}
						paginationState={{ pageIndex, pageSize }}
						showPageSizeOptions
						sortingState={sortingState}
						withFilters
						withHeaders
						withPagination
						withStripes
						withTabs
						withSideBorders
					/>
				</>
			)}
		</div>
	);
};

export default DonorSummaryTable;
