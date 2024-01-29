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

import { ContentError, ContentLoader } from '@/app/components/placeholders';
import DASHBOARD_SUMMARY_QUERY from '@/app/gql/gateway/DASHBOARD_SUMMARY_QUERY';
import PROGRAM_DONOR_PUBLISHED_ANALYSIS_BY_DATE_RANGE_QUERY from '@/app/gql/gateway/PROGRAM_DONOR_PUBLISHED_ANALYSIS_BY_DATE_RANGE_QUERY';
import { useGatewayQuery } from '@/app/hooks/useApolloQuery';
import { useTimeout } from '@/app/hooks/useTimeout';
import { QueryHookOptions, useQuery } from '@apollo/client';
import { Typography, css, useElementDimension, useTheme } from '@icgc-argo/uikit';
import { format as formatDate, subDays } from 'date-fns';
import { find } from 'lodash';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
	DashboardCard,
	DashboardSummaryData,
	DashboardSummaryDataVariables,
	POLL_INTERVAL_MILLISECONDS,
} from '../common';
import Legend from './Legend';
import LineChart from './LineChart';
import { makeChartLineMeta } from './LineChart/utils';
import RangeControlBar from './RangeControlBar';
import { rangeButtons } from './rangeButtonsConfig';
import {
	ChartType,
	DonorField,
	ProgramDonorPublishedAnalysisByDateRangeQueryData,
	ProgramDonorPublishedAnalysisByDateRangeQueryVariables,
	RangeButtons,
} from './types';

const CHART_HEIGHT = 220;
const CHART_PADDING = 12;
const CHART_BUCKETS = 7;
const DATE_RANGE_DISPLAY_FORMAT = 'Y/MM/dd';

// TODO: replace with program first published date
const TEMP_ALL_START_DATE = new Date('2020-06-01T00:00:00.000Z');

const useProgramDonorPublishedAnalysisByDateRangeQuery = (
	bucketCount: number,
	dateRangeFrom: string,
	dateRangeTo: string,
	donorFields: DonorField[],
	programShortName: string,
	options: Omit<
		QueryHookOptions<
			ProgramDonorPublishedAnalysisByDateRangeQueryData,
			ProgramDonorPublishedAnalysisByDateRangeQueryVariables
		>,
		'variables'
	> = {},
) => {
	const pollingTimeout = useTimeout(30000);
	const hook = useGatewayQuery(PROGRAM_DONOR_PUBLISHED_ANALYSIS_BY_DATE_RANGE_QUERY, {
		...options,
		skip: !dateRangeFrom || !dateRangeTo,
		variables: {
			bucketCount,
			dateRangeFrom,
			dateRangeTo,
			donorFields,
			programShortName,
		},
		pollInterval: !pollingTimeout ? POLL_INTERVAL_MILLISECONDS : 0,
	});
	return hook;
};

const ClinicalChart = ({
	programShortName,
	chartType,
	title,
}: {
	programShortName: string;
	chartType: ChartType;
	title: string;
}) => {
	const theme = useTheme();

	// handle date range selection
	const [dateRangeFrom, setDateRangeFrom] = useState<string | null>(null);
	const [dateRangeTo, setDateRangeTo] = useState<string | null>(null);
	const [activeRangeBtn, setActiveRangeBtn] = useState<RangeButtons>('All');

	useEffect(() => {
		const daysInRange = find(rangeButtons, { title: activeRangeBtn }).days;
		const today = new Date();
		const dateRangeStart =
			activeRangeBtn === 'All'
				? TEMP_ALL_START_DATE // TODO: change to program first published date
				: subDays(today, daysInRange);
		setDateRangeFrom(dateRangeStart.toString());
		setDateRangeTo(today.toString());
	}, [activeRangeBtn]);

	// get committed donors & TODO program first published date
	const {
		data: programQueryData,
		error: programQueryError,
		loading: programQueryLoading,
	} = useQuery<DashboardSummaryData, DashboardSummaryDataVariables>(DASHBOARD_SUMMARY_QUERY, {
		variables: { programShortName },
	});

	// get data for chart lines - program donor published analyses
	// aggregated by date range
	const donorFieldsByChartType = makeChartLineMeta(theme)
		.filter((line) => line.chartType === chartType)
		.map((line) => line.field);

	const {
		data: { programDonorPublishedAnalysisByDateRange: rangeQueryData = [] } = {
			programDonorPublishedAnalysisByDateRange: null,
		},
		error: rangeQueryError,
		loading: rangeQueryLoading = true,
	} = useProgramDonorPublishedAnalysisByDateRangeQuery(
		CHART_BUCKETS,
		dateRangeFrom,
		dateRangeTo,
		donorFieldsByChartType as DonorField[],
		programShortName,
	);

	// make the chart responsive
	const lineChartRef = useRef<HTMLDivElement>(null);
	const { resizing, width: responsiveWidth } = useElementDimension(lineChartRef);
	const [initialWidth, setInitialWidth] = useState<number | null>(null);
	useLayoutEffect(() => {
		if (lineChartRef.current) {
			setInitialWidth(lineChartRef.current.getBoundingClientRect().width);
		}
	});

	// handle the legend
	const [activeLines, setActiveLines] = useState(donorFieldsByChartType);
	const handleLegendInput = (line: string) => {
		const nextLines = activeLines.includes(line)
			? activeLines.filter((activeLine) => activeLine !== line)
			: activeLines.concat(line);
		setActiveLines(nextLines);
	};
	const hasError = rangeQueryError || programQueryError;
	const isLoading =
		(rangeQueryData && rangeQueryData.length === 0) || rangeQueryLoading || programQueryLoading;
	const showLegend = chartType === 'molecular' && !isLoading && !hasError;

	return (
		<DashboardCard>
			<div
				style={{
					display: 'flex',
					height: 26,
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<Typography variant="default" component="span">
					{title}
				</Typography>
				{showLegend && (
					<Legend
						activeLines={activeLines}
						chartType={chartType}
						handleLegendInput={handleLegendInput}
					/>
				)}
			</div>
			<div
				css={css`
					height: ${CHART_HEIGHT + CHART_PADDING}px;
					padding: ${CHART_PADDING}px 0;
				`}
			>
				{hasError ? (
					<ContentError />
				) : isLoading ? (
					<ContentLoader />
				) : (
					<>
						<RangeControlBar
							activeBtn={activeRangeBtn}
							handleBtnClick={setActiveRangeBtn}
							rangeArray={[
								formatDate(new Date(dateRangeFrom), DATE_RANGE_DISPLAY_FORMAT),
								formatDate(new Date(dateRangeTo), DATE_RANGE_DISPLAY_FORMAT),
							]}
						/>
						<div
							ref={lineChartRef}
							style={{
								width: '100%',
								paddingTop: CHART_PADDING,
								filter: `blur(${resizing ? 8 : 0}px)`,
							}}
						>
							<LineChart
								activeLines={activeLines}
								chartType={chartType}
								data={rangeQueryData as any}
								hasQuarterLines
								hasYAxisThresholdLine
								height={CHART_HEIGHT}
								horizontalGuides={4}
								precision={0}
								width={responsiveWidth || initialWidth}
								yAxisThreshold={programQueryData.program.commitmentDonors}
								yAxisThresholdLabel="Committed"
								yAxisTitle="donors"
							/>
						</div>
					</>
				)}
			</div>
		</DashboardCard>
	);
};

export default ClinicalChart;
