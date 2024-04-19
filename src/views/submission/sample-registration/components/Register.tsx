import Card from '@/app/components/Card';
import ContentMain from '@/app/components/Content/ContentMain';
import FileError from '@/app/components/FileError';
import NoDataMessage from '@/app/components/NoData';
import { BreadcrumbTitle, HelpLink, PageHeader } from '@/app/components/PageHeader/PageHeader';
import CLEAR_CLINICAL_REGISTRATION_MUTATION from '@/app/gql/clinical/CLEAR_CLINICAL_REGISTRATION_MUTATION';
import CLINICAL_SCHEMA_VERSION from '@/app/gql/clinical/CLINICAL_SCHEMA_VERSION';
import GET_REGISTRATION_QUERY from '@/app/gql/clinical/GET_REGISTRATION_QUERY';
import {
	useAppConfigContext,
	useAuthContext,
	useClinicalMutation,
	useClinicalQuery,
	useCommonToasters,
	useSubmissionSystemStatus,
	useToaster,
} from '@/app/hooks';
import { UPLOAD_REGISTRATION } from '@/global/constants';
import { getProgramPath, notNull } from '@/global/utils';
import { createFileFormData, uploadFileRequest } from '@/global/utils/form';
import { css } from '@emotion/react';
import {
	BUTTON_SIZES,
	BUTTON_VARIANTS,
	Button,
	NOTIFICATION_VARIANTS,
	NotificationInteraction,
	Typography,
} from '@icgc-argo/uikit';
import { get, isFunction, isString } from 'lodash';
import { useState } from 'react';
import { Container } from 'react-grid-system';
import { useMutation } from 'react-query';
import urlJoin from 'url-join';
import FilePreview from './FilePreview';
import Instructions from './Instructions';
import ProgressBar from './ProgressBar';
import RegisterSamplesModal from './RegisterSampleModal';
import UploadError from './UploadError';

const Register = ({ shortName }: { shortName: string }) => {
	const {
		data,
		refetch,
		updateQuery: updateClinicalRegistrationQuery,
	} = useClinicalQuery(GET_REGISTRATION_QUERY, {
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

	/**
	 * new HTTP endpoints don't return the same objects as strictly typed gql endpoints
	 * data shape needs to match so state can stay in sync on the frontend
	 */
	type RequiredProperty = {
		key: string;
		accessor: string | ((resp: any) => void);
		defaultValue: any;
	};
	const requiredProperties: RequiredProperty[] = [
		{
			key: 'errors',
			accessor: (resp) =>
				resp.errors.map((error) => ({
					type: error.type,
					message: error.message,
					row: error.index,
					field: error.fieldName,
					value: error.info.value,
					sampleId: error.info.sampleSubmitterId,
					donorId: error.info.donorSubmitterId,
					specimenId: error.info.specimenSubmitterId,
				})),
			defaultValue: [],
		},
	];

	const getValueFromAccessor = (data, accessor, defaultValue) => {
		if (isFunction(accessor)) {
			return accessor(data) || defaultValue;
		} else if (isString(accessor)) {
			return get(data, accessor, defaultValue);
		}
	};

	// match a certain shape from gql
	const satisfyGQL = ({
		apiResp,
		requiredProperties,
	}: {
		apiResp: any;
		requiredProperties: RequiredProperty[];
	}) =>
		requiredProperties.reduce((acc, curr) => {
			const value = getValueFromAccessor(apiResp, curr.accessor, curr.defaultValue);
			return { ...acc, ...{ [curr.key]: value } };
		}, {});

	// handlers
	const uploadURL = urlJoin(CLINICAL_API_ROOT, getProgramPath(UPLOAD_REGISTRATION, shortName));
	const uploadFile = useMutation<Response, Response, FormData>(
		(formData) => {
			return uploadFileRequest(uploadURL, formData, egoJwt);
		},
		{
			// success of query - not HTTP status
			onSuccess: async (data, variables, context) => {
				// succesful uploads will have state on the server
				if ([200, 201].includes(data.status)) {
					refetch();
				} else {
					// errors are not persisted server side - manually update cache (state store)
					const registration = await data.json();
					const registrationUpdate = satisfyGQL({ apiResp: registration, requiredProperties });

					updateClinicalRegistrationQuery((previous) => {
						// update Apollo cache
						const update = { ...previous.clinicalRegistration, ...registrationUpdate };
						return { clinicalRegistration: update };
					});
				}
			},

			onError: (error) => {
				commonToaster.unknownError();
			},
		},
	);

	const handleUpload = (file: FileList) => {
		const fileFormData = createFileFormData(file, 'registrationFile');
		return uploadFile.mutate(fileFormData);
	};

	const handleRegister = () => {
		setShowModal((state) => !state);
	};

	// file preview clear
	const [clearRegistration] = useClinicalMutation(CLEAR_CLINICAL_REGISTRATION_MUTATION);
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
					<Container
						css={css`
							padding-bottom: 0px;
						`}
					>
						<Instructions
							dictionaryVersion={dictionaryVersion}
							handleUpload={handleUpload}
							isUploading={uploadFile.isLoading}
							handleRegister={handleRegister}
							flags={instructionFlags}
						/>
					</Container>
					<Container
						css={css`
							flex: 1;
						`}
					>
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
					</Container>
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
