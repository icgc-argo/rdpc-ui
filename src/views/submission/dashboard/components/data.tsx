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
	CompleteIncompleteFilterCounts,
	CompletedInProgressFailedFilterCounts,
	DataSubmittedDataNotSubmittedFilterCounts,
	TumorNormalMatchedPairStatusCounts,
	TumorNormalStatusCounts,
	ValidInvalidFilterCounts,
} from '../DonorDataSummary/types';

export type ProgramDonorReleaseStats = {
	registeredDonorsCount: number;
	fullyReleasedDonorsCount: number;
	partiallyReleasedDonorsCount: number;
	noReleaseDonorsCount: number;
	donorsInvalidWithCurrentDictionaryCount: number;
	percentageCoreClinical?: number;
	percentageTumourAndNormal?: number;
	coreCompletion?: CompleteIncompleteFilterCounts;
	sampleStatus?: ValidInvalidFilterCounts;
	rawReadsStatus?: ValidInvalidFilterCounts;
	alignmentStatusCount?: CompletedInProgressFailedFilterCounts;
	sangerStatusCount?: CompletedInProgressFailedFilterCounts;
	mutectStatusCount?: CompletedInProgressFailedFilterCounts;
	openAccessStatusCount?: CompletedInProgressFailedFilterCounts;
	completedWorkflowRuns?: number;
	inProgressWorkflowRuns?: number;
	failedWorkflowRuns?: number;
	rnaRawReadStatus?: DataSubmittedDataNotSubmittedFilterCounts;
	rnaSampleStatus?: DataSubmittedDataNotSubmittedFilterCounts;
	rnaAlignmentStatusCount?: CompletedInProgressFailedFilterCounts;
	dnaTNRegisteredStatus?: TumorNormalStatusCounts;
	dnaTNMatchedPairStatus?: TumorNormalMatchedPairStatusCounts;
};

export const EMPTY_PROGRAM_SUMMARY_STATS: ProgramDonorReleaseStats = {
	registeredDonorsCount: 0,
	fullyReleasedDonorsCount: 0,
	partiallyReleasedDonorsCount: 0,
	noReleaseDonorsCount: 0,
	donorsInvalidWithCurrentDictionaryCount: 0,
	percentageCoreClinical: 0,
	percentageTumourAndNormal: 0,
	coreCompletion: {
		completed: 0,
		incomplete: 0,
		noData: 0,
	},
	sampleStatus: {
		valid: 0,
		invalid: 0,
	},
	dnaTNRegisteredStatus: {
		tumorAndNormal: 0,
		tumorOrNormal: 0,
		noData: 0,
	},
	dnaTNMatchedPairStatus: {
		tumorNormalMatchedPair: 0,
		tumorNormalNoMatchedPair: 0,
		tumorNormalMatchedPairMissingRawReads: 0,
		noData: 0,
	},
	rawReadsStatus: {
		valid: 0,
		invalid: 0,
	},
	alignmentStatusCount: {
		completed: 0,
		inProgress: 0,
		failed: 0,
		noData: 0,
	},
	sangerStatusCount: {
		completed: 0,
		inProgress: 0,
		failed: 0,
		noData: 0,
	},
	mutectStatusCount: {
		completed: 0,
		inProgress: 0,
		failed: 0,
		noData: 0,
	},
	openAccessStatusCount: {
		completed: 0,
		inProgress: 0,
		failed: 0,
		noData: 0,
	},
	completedWorkflowRuns: 0,
	inProgressWorkflowRuns: 0,
	failedWorkflowRuns: 0,
	rnaRawReadStatus: {
		dataSubmitted: 0,
		noDataSubmitted: 0,
	},
	rnaSampleStatus: {
		dataSubmitted: 0,
		noDataSubmitted: 0,
	},
	rnaAlignmentStatusCount: {
		completed: 0,
		inProgress: 0,
		failed: 0,
		noData: 0,
	},
};
