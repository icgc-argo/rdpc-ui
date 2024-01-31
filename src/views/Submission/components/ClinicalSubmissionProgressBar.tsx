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

import CLINICAL_SUBMISSION_QUERY from '@/gql/clinical/CLINICAL_SUBMISSION_QUERY';
import { useClinicalQuery } from '@/hooks/useApolloQuery';
import { useSubmissionSystemStatus } from '@/hooks/useSubmissionSystemStatus';
import { css, Progress } from '@icgc-argo/uikit';
import { ComponentProps, ComponentType, useMemo, useState } from 'react';

const ClinicalSubmissionProgressBar: ComponentType<{
	programShortName: string;
	approvalBarWidth?: number;
}> = ({ programShortName, approvalBarWidth }) => {
	const [] = useState<FileList | null>(null);
	const { isDisabled: isSubmissionSystemDisabled } = useSubmissionSystemStatus();

	const { data, loading: isLoading } = useClinicalQuery(CLINICAL_SUBMISSION_QUERY, {
		variables: {
			programShortName,
		},
	});

	const allDataErrors = useMemo(
		() =>
			isLoading
				? []
				: data.clinicalSubmissions.clinicalEntities.reduce(
						(acc, entity) => [
							...acc,
							...entity.dataErrors.map((err) => ({
								...err,
								fileName: entity.batchName,
							})),
						],
						[],
				  ),
		[data, isLoading],
	);

	const hasDataError = !!allDataErrors.length;
	const hasSchemaError =
		!isLoading &&
		!!data.clinicalSubmissions.clinicalEntities.length &&
		data.clinicalSubmissions.clinicalEntities.some(({ schemaErrors }) => !!schemaErrors.length);
	const hasSomeEntity =
		!isLoading && data.clinicalSubmissions.clinicalEntities.some(({ records }) => !!records.length);
	const hasSchemaErrorsAfterMigration =
		!isLoading && data.clinicalSubmissions.state === 'INVALID_BY_MIGRATION';
	const isReadyForValidation = hasSomeEntity && !hasSchemaError && !hasSchemaErrorsAfterMigration;
	const isReadyForSignoff = isReadyForValidation && data.clinicalSubmissions.state === 'VALID';
	const isPendingApproval = !isLoading && data.clinicalSubmissions.state === 'PENDING_APPROVAL';

	const progressStates: {
		upload: ComponentProps<typeof Progress.Item>['state'];
		validate: ComponentProps<typeof Progress.Item>['state'];
		signOff: ComponentProps<typeof Progress.Item>['state'];
	} = {
		upload: isSubmissionSystemDisabled
			? 'locked'
			: isReadyForValidation
			? 'success'
			: hasSchemaError || hasSchemaErrorsAfterMigration
			? 'error'
			: 'disabled',
		validate: isSubmissionSystemDisabled
			? 'locked'
			: isReadyForSignoff || isPendingApproval
			? 'success'
			: isReadyForValidation
			? hasDataError
				? 'error'
				: 'pending'
			: 'disabled',
		signOff: isSubmissionSystemDisabled
			? 'locked'
			: isReadyForSignoff
			? 'pending'
			: isPendingApproval
			? 'success'
			: 'disabled',
	};

	const pendingApprovalWidth = `${approvalBarWidth || 100}px`;
	return (
		<Progress>
			<Progress.Item text="Upload" state={progressStates.upload} />
			<Progress.Item text="Validate" state={progressStates.validate} />
			<Progress.Item text="Sign Off" state={progressStates.signOff} />
			{isPendingApproval && (
				<Progress.Item
					css={css`
						width: ${pendingApprovalWidth};
					`}
					text="Pending Approval"
					state="locked"
				/>
			)}
		</Progress>
	);
};

export default ClinicalSubmissionProgressBar;
