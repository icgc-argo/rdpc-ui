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
'use client';

import Instructions from '@/app/(post-login)/submission/program/[shortName]/sample-registration/components/Instructions';
import ProgressBar from '@/app/(post-login)/submission/program/[shortName]/sample-registration/components/ProgressBar';
import Card from '@/components/Card';
import ContentMain from '@/components/Content/ContentMain';
import NoDataMessage from '@/components/NoData';
import { BreadcrumbTitle, HelpLink, PageHeader } from '@/components/PageHeader/PageHeader';
import { UPLOAD_REGISTRATION } from '@/global/constants';
import { getProgramPath, notNull } from '@/global/utils';
import { createFileFormData, uploadFileRequest } from '@/global/utils/form';
import CLEAR_CLINICAL_REGISTRATION_MUTATION from '@/gql/clinical/CLEAR_CLINICAL_REGISTRATION_MUTATION';
import CLINICAL_SCHEMA_VERSION from '@/gql/clinical/CLINICAL_SCHEMA_VERSION';
import GET_REGISTRATION_QUERY from '@/gql/clinical/GET_REGISTRATION_QUERY';
import { useAppConfigContext } from '@/hooks/AppProvider';
import { useAuthContext } from '@/hooks/AuthProvider';
import { useToaster } from '@/hooks/ToastProvider';
import { useClinicalQuery } from '@/hooks/useApolloQuery';
import useCommonToasters from '@/hooks/useCommonToasters';
import { useSubmissionSystemStatus } from '@/hooks/useSubmissionSystemStatus';
import { css } from '@/lib/emotion';
import { useMutation as useGQLMutation, useQuery } from '@apollo/client';
import {
	BUTTON_SIZES,
	BUTTON_VARIANTS,
	Button,
	NOTIFICATION_VARIANTS,
	NotificationInteraction,
	Typography,
} from '@icgc-argo/uikit';
import { get } from 'lodash';
import { useState } from 'react';
import { useMutation } from 'react-query';
import urlJoin from 'url-join';
import FileError from '../../../../../../components/FileError';
import FilePreview from './components/FilePreview';
import RegisterSamplesModal from './components/RegisterSampleModal';
import UploadError from './components/UploadError';

const Register = ({ shortName }: { shortName: string }) => {
	const {
		data,
		refetch,
		updateQuery: updateClinicalRegistrationQuery,
	} = useQuery(GET_REGISTRATION_QUERY, {
		variables: { shortName },
	});

	const { egoJwt } = useAuthContext();

	// get dictionary version
	const latestDictionaryResponse = useClinicalQuery(CLINICAL_SCHEMA_VERSION);
	const { loading: isLoadingDictVersion, data: dictData } = latestDictionaryResponse;
	const dictionaryVersion =
		(!isLoadingDictVersion && dictData?.clinicalSubmissionSchemaVersion) || '';

	// toasters
	const toaster = useToaster();
	const commonToaster = useCommonToasters();

	// docs url
	const { DOCS_URL_ROOT, CLINICAL_API_ROOT } = useAppConfigContext();
	const helpUrl = urlJoin(DOCS_URL_ROOT, '/docs/submission/registering-samples');

	// modal state
	const [showRegisterModal, setShowModal] = useState(false);

	// pull out some clinical registration data
	const clinicalRegistration = data?.clinicalRegistration;
	const schemaOrValidationErrors = get(clinicalRegistration, 'errors', []);
	const fileErrors = get(clinicalRegistration, 'fileErrors') || [];

	const { isDisabled: isSubmissionSystemDisabled } = useSubmissionSystemStatus();

	const instructionFlags = {
		uploadEnabled: !isSubmissionSystemDisabled,
		registrationEnabled: !isSubmissionSystemDisabled && !!get(clinicalRegistration, 'id'),
	};

	const hasClinicalRegistration = !!(clinicalRegistration && clinicalRegistration.records.length);
	const hasErrors = !!schemaOrValidationErrors.length;
	const registrationId = get(clinicalRegistration, 'id', '') || '';

	// handlers
	const uploadFile = useMutation(
		(formData) => {
			const url = urlJoin(CLINICAL_API_ROOT, getProgramPath(UPLOAD_REGISTRATION, shortName));
			return uploadFileRequest(url, formData, egoJwt);
		},
		{
			onError: () => {
				commonToaster.unknownError();
			},
		},
	);

	const handleUpload = (file: File) => {
		const fileFormData = createFileFormData(file, 'registrationFile');
		return uploadFile.mutate(fileFormData);
	};

	const handleRegister = () => {
		setShowModal((state) => !state);
	};

	// file preview clear
	const [clearRegistration] = useGQLMutation(CLEAR_CLINICAL_REGISTRATION_MUTATION);
	const handleClearClick = async () => {
		if (clinicalRegistration?.id == null) {
			refetch();
			return;
		}

		try {
			await clearRegistration({
				variables: {
					shortName,
					registrationId,
				},
			});
			await refetch();
		} catch (err) {
			await refetch();
			toaster.addToast({
				variant: 'ERROR',
				title: 'Something went wrong',
				content: 'Uh oh! It looks like something went wrong. This page has been reloaded.',
			});
		}
	};

	const handleRegisterCancelClick = () => {
		setShowModal(false);
	};

	const onFileErrorClose =
		(index: number) =>
		({ type }: { type: NotificationInteraction }) => {
			if (type === 'CLOSE') {
				updateClinicalRegistrationQuery((previous) => ({
					...previous,
					clinicalRegistration: {
						...previous.clinicalRegistration,
						fileErrors: previous?.clinicalRegistration?.fileErrors?.filter((_, i) => i !== index),
					},
				}));
			}
		};

	return (
		<>
			<div
				css={css`
					display: flex;
					flex-direction: column;
				`}
			>
				<PageHeader
					leftSlot={
						<>
							<BreadcrumbTitle breadcrumbs={[shortName, 'Register Samples']} />
							<ProgressBar
								{...{
									isSubmissionSystemDisabled,
									hasClinicalRegistration,
									hasErrors,
								}}
							/>
						</>
					}
					rightSlot={<HelpLink url={helpUrl} />}
				/>
				<ContentMain>
					<Instructions
						dictionaryVersion={dictionaryVersion}
						handleUpload={handleUpload}
						isUploading={uploadFile.isLoading}
						handleRegister={handleRegister}
						flags={instructionFlags}
					/>
					{fileErrors.filter(notNull).map((fileError, index) => (
						<FileError
							fileError={{
								message: fileError.message,
								title: `File failed to upload: ${fileError?.fileNames.join(', ')}`,
							}}
							index={index}
							onClose={onFileErrorClose}
							key={index}
						/>
					))}
					{clinicalRegistration?.records.length ? (
						<Card
							fill
							title="File Preview"
							action={
								<Button
									id="button-register-clear-file"
									variant={BUTTON_VARIANTS.TEXT}
									size={BUTTON_SIZES.SM}
									onClick={handleClearClick}
									disabled={false}
								>
									<Typography variant="data">Clear</Typography>
								</Button>
							}
						>
							<FilePreview registration={clinicalRegistration} />
						</Card>
					) : schemaOrValidationErrors.length ? (
						<UploadError
							level={NOTIFICATION_VARIANTS.ERROR}
							onClearClick={handleClearClick}
							title={`${schemaOrValidationErrors.length.toLocaleString()} error(s) found in uploaded file`}
							errors={schemaOrValidationErrors}
							subtitle={
								'Your file cannot be processed. Please correct the following errors and reupload your file.'
							}
						/>
					) : (
						<Card fill>
							<NoDataMessage loading={false} />
						</Card>
					)}
				</ContentMain>
			</div>

			{/** Modals */}
			{showRegisterModal && (
				<RegisterSamplesModal
					onCancelClick={handleRegisterCancelClick}
					{...{ shortName, registrationId }}
				/>
			)}
		</>
	);
};

export default Register;
