/*
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
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

import { ContentError } from '@/app/components/placeholders';
import { Typography, css } from '@icgc-argo/uikit';
import { Col, Row } from 'react-grid-system';
import { DashboardCard } from '../common';
import DonorSummaryTable from './DonorSummaryTable';
import DownloadButtons from './DownloadButtons';
import EmptyDonorSummaryState from './EmptyDonorSummaryTable';
import { EMPTY_PROGRAM_SUMMARY_STATS, formatDonorSummarySortingRequest } from './common';
import { useProgramDonorsSummaryQuery } from './queries/useProgramDonorsSummaryQuery';
import { DonorSummarySortingState } from './types';

const CardTitle = () => (
	<Typography variant="default" component="span">
		Donor Data Summary
	</Typography>
);

const DEFAULT_PAGE_SIZE = 20;
const DEFAULT_SORTING: DonorSummarySortingState[] = [
	{
		id: 'updatedAt',
		desc: true,
	},
];
const DEFAULT_OFFSET = 0;

const DonorDataSummary = ({ programShortName }) => {
	// using the default query variables will get us all registered donors
	const {
		data: { programDonorSummary: { stats: programDonorSummaryStats } } = {
			programDonorSummary: { stats: EMPTY_PROGRAM_SUMMARY_STATS },
		},
		error: programDonorsSummaryQueryError,
		loading: isCardLoading = true,
	} = useProgramDonorsSummaryQuery({
		programShortName,
		first: DEFAULT_PAGE_SIZE,
		offset: DEFAULT_OFFSET,
		sorts: formatDonorSummarySortingRequest(DEFAULT_SORTING),
	});

	const isDonorSummaryEntriesEmpty =
		!programDonorSummaryStats || programDonorSummaryStats.registeredDonorsCount === 0;

	const isDataValid =
		!isCardLoading && !programDonorsSummaryQueryError && !isDonorSummaryEntriesEmpty;

	return (
		<DashboardCard>
			<Row>
				<Col md={3.5} sm={12}>
					<CardTitle />
				</Col>
				{isDataValid && (
					<Col
						md={8.5}
						sm={12}
						css={css`
							display: flex;
							align-self: center;
							justify-content: flex-end;
						`}
					>
						<DownloadButtons programShortName={programShortName} />
					</Col>
				)}
			</Row>
			{!isCardLoading && programDonorsSummaryQueryError ? (
				<ContentError />
			) : !isCardLoading && isDonorSummaryEntriesEmpty ? (
				<EmptyDonorSummaryState />
			) : (
				<DonorSummaryTable
					initialSorting={DEFAULT_SORTING}
					isCardLoading={isCardLoading}
					programShortName={programShortName}
				/>
			)}
		</DashboardCard>
	);
};

export default DonorDataSummary;
