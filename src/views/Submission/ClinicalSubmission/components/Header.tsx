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

import { ModalPortal } from '@/components/Modal';
import { BreadcrumbTitle, HelpLink, PageHeader } from '@/components/PageHeader/PageHeader';
import { sleep } from '@/global/utils';
import CLEAR_CLINICAL_SUBMISSION from '@/gql/clinical/CLEAR_CLINICAL_SUBMISSION';
import APPROVE_SUBMISSION_MUTATION from '@/gql/gateway/APPROVE_SUBMISSION_MUTATION';
import REOPEN_SUBMISSION_MUTATION from '@/gql/gateway/REOPEN_SUBMISSION_MUTATION';
import {
	useAppConfigContext,
	useAuthContext,
	useGlobalLoader,
	useSubmissionSystemStatus,
	useToaster,
} from '@/hooks';
import useCommonToasters from '@/hooks/useCommonToasters';
import useUserConfirmationModalState from '@/hooks/useUserConfirmationModalState';
import { css, useTheme } from '@/lib/emotion';
import { useMutation } from '@apollo/client';
import { Button, Modal } from '@icgc-argo/uikit';
import { useRouter } from 'next/navigation';
import { FC, useMemo } from 'react';
import { Row } from 'react-grid-system';
import urlJoin from 'url-join';
import ProgressBar from './ProgressBar';

const placeholderClinicalSubmissionQueryData = (shortName: string) => ({
	clinicalSubmissions: {
		version: '',
		programShortName: shortName,
		clinicalEntities: [],
		fileErrors: [],
		id: '',
		state: null,
		updatedAt: '',
		updatedBy: '',
		__typename: 'ClinicalSubmissionData',
	},
});

type HeaderProps = {
	programShortName: string;
	showProgress: boolean;
	clinicalVersion: string;
	clinicalEntities: any;
	clinicalState: any;
	refetch: any;
	updateQuery: any;
};

const Header: FC<HeaderProps> = ({
	programShortName,
	showProgress,
	clinicalVersion,
	clinicalEntities,
	clinicalState,
	refetch: refetchClinicalSubmission,
	updateQuery: updateClinicalSubmissionQuery,
}) => {
	const theme = useTheme();
	const router = useRouter();
	const { modalProps, isModalShown, getUserConfirmation } = useUserConfirmationModalState();

	// docs url
	const { DOCS_URL_ROOT } = useAppConfigContext();
	const helpUrl = urlJoin(DOCS_URL_ROOT, '/docs/submission/submitting-clinical-data');
	const { permissions, TokenUtils } = useAuthContext();

	const isDcc = useMemo(() => TokenUtils.isDccMember(permissions), [permissions]);
	const isRdpc = useMemo(() => TokenUtils.isRdpcMember(permissions), [permissions]);
	const isAdmin = isDcc || isRdpc;

	const isPendingApproval = clinicalState === 'PENDING_APPROVAL';

	const { setGlobalLoading } = useGlobalLoader();

	const commonToaster = useCommonToasters();
	const toaster = useToaster();

	const { isDisabled: isSubmissionSystemDisabled } = useSubmissionSystemStatus();

	const [approveClinicalSubmission] = useMutation(APPROVE_SUBMISSION_MUTATION, {
		variables: {
			programShortName,
			submissionVersion: clinicalVersion,
		},
	});

	const [reopenSubmission] = useMutation(REOPEN_SUBMISSION_MUTATION, {
		variables: {
			programShortName,
			submissionVersion: clinicalVersion,
		},
	});

	const [clearClinicalSubmission] = useMutation(CLEAR_CLINICAL_SUBMISSION, {
		variables: {
			programShortName,
			submissionVersion: clinicalVersion,
		},
	});

	const handleSubmissionApproval = async () => {
		const didUserConfirm = await getUserConfirmation({
			title: 'Approve Submission?',
			children: 'Are you sure you want to approve this clinical submission?',
			actionButtonText: 'Yes, Approve',
			actionButtonId: 'modal-confirm-approve',
			buttonSize: 'sm',
		});

		if (didUserConfirm) {
			setGlobalLoading(true);
			await sleep();
			try {
				await approveClinicalSubmission();

				updateClinicalSubmissionQuery((previous: any) => ({
					...previous,
					clinicalSubmissions:
						placeholderClinicalSubmissionQueryData(programShortName).clinicalSubmissions,
				}));

				router.push('/');
				toaster.addToast({
					variant: 'SUCCESS',
					interactionType: 'CLOSE',
					title: 'Clinical Data is successfully approved',
					content: `${programShortName} updated clinical data has been approved.`,
				});
			} catch (err) {
				await refetchClinicalSubmission();
				commonToaster.unknownErrorWithReloadMessage();
			} finally {
				setGlobalLoading(false);
			}
		}
	};

	const handleSubmissionReopen = async () => {
		const didUserConfirm = await getUserConfirmation({
			title: isDcc ? 'Reopen Submission?' : 'Are you sure you want to reopen your submission?',
			children: isDcc
				? 'Are you sure you want to reopen this clinical submission?'
				: 'If you reopen your clinical submission it will be recalled from DCC approval and your workspace will be open for modifications.',
			actionButtonText: isDcc ? 'Yes, Reopen' : 'Yes, Reopen Submission',
			actionButtonId: 'modal-confirm-reopen',
			buttonSize: 'sm',
		});

		if (didUserConfirm) {
			setGlobalLoading(true);
			await sleep();
			try {
				await reopenSubmission();
			} catch (err) {
				await refetchClinicalSubmission();
				commonToaster.unknownErrorWithReloadMessage();
			} finally {
				setGlobalLoading(false);
			}
		}
	};

	const handleSubmissionClear = async () => {
		setGlobalLoading(true);
		await sleep();
		try {
			await clearClinicalSubmission();
			toaster.addToast({
				variant: 'SUCCESS',
				interactionType: 'CLOSE',
				title: 'Submission cleared',
				content: `All uploaded clinical files have been cleared.`,
			});
		} catch (err) {
			await refetchClinicalSubmission();
			commonToaster.unknownErrorWithReloadMessage();
		} finally {
			setGlobalLoading(false);
		}
	};

	return (
		<>
			{isModalShown && (
				<ModalPortal>
					<Modal {...modalProps} />
				</ModalPortal>
			)}
			<PageHeader
				leftSlot={
					<>
						<BreadcrumbTitle breadcrumbs={[programShortName, 'Submit Clinical Data']} />{' '}
						<ProgressBar clinicalEntities={clinicalEntities} clinicalState={clinicalState} />
					</>
				}
				rightSlot={
					<Row nogutter align="center">
						{isPendingApproval && isAdmin && (
							<>
								<Button
									variant={isAdmin ? 'secondary' : 'text'}
									isAsync
									css={css`
										margin-right: 10px;
									`}
									onClick={handleSubmissionReopen}
								>
									REOPEN SUBMISSION
								</Button>

								<Button id="button-approve" size="sm" isAsync onClick={handleSubmissionApproval}>
									APPROVE
								</Button>
							</>
						)}
						{!isPendingApproval && (
							<>
								<Button
									variant="text"
									css={css`
										margin-right: 10px;
									`}
									disabled={isSubmissionSystemDisabled || !clinicalVersion}
									onClick={handleSubmissionClear}
								>
									CLEAR SUBMISSION
								</Button>
								<HelpLink url={helpUrl} />
							</>
						)}
					</Row>
				}
				css={css`
					background-color: ${isPendingApproval ? theme.colors.accent3_4 : theme.colors.white};
				`}
			/>
		</>
	);
};

export default Header;
