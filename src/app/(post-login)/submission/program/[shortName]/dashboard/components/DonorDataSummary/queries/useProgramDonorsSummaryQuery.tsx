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

import PROGRAM_DONOR_SUMMARY_QUERY from '@/app/gql/gateway/PROGRAM_DONOR_SUMMARY_QUERY';
import { useGatewayQuery, useTimeout } from '@/app/hooks';
import { QueryHookOptions } from '@apollo/client';
import { POLL_INTERVAL_MILLISECONDS } from '../../common';
import {
	DonorSummaryEntrySort,
	ProgramDonorSummaryFilter,
	ProgramDonorsSummaryQueryData,
	ProgramDonorsSummaryQueryVariables,
} from '../types';

export const useProgramDonorsSummaryQuery = ({
	programShortName,
	first,
	offset,
	sorts,
	filters,
	options = {},
}: {
	programShortName: string;
	first: number;
	offset: number;
	sorts?: DonorSummaryEntrySort[];
	filters?: ProgramDonorSummaryFilter[];
	options?: Omit<
		QueryHookOptions<ProgramDonorsSummaryQueryData, ProgramDonorsSummaryQueryVariables>,
		'variables'
	>;
}) => {
	const pollingTimeout = useTimeout(30000);
	const variables = {
		programShortName,
		first,
		offset,
		sorts,
		...(filters && Object.keys(filters).length > 0 && { filters }),
	};
	const hook = useGatewayQuery(PROGRAM_DONOR_SUMMARY_QUERY, {
		...options,
		variables,
		pollInterval: !pollingTimeout ? POLL_INTERVAL_MILLISECONDS : 0,
	});
	return hook;
};
