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

import ContentMain from '@/components/Content/ContentMain';
import ErrorNotification, { ErrorReportColumns } from '@/components/ErrorNotification';
import {
	errorNotificationTableProps,
	getDefaultErrorTableColumns,
} from '@/components/ErrorNotification/ErrorNotificationDefaultTable';
import FileError from '@/components/FileError';
import { ModalPortal } from '@/components/Modal';
import {
	PROGRAM_DASHBOARD_PATH,
	PROGRAM_SHORT_NAME_PATH,
	UPLOAD_CLINICAL_DATA,
} from '@/global/constants';
import { displayDateAndTime, getProgramPath, sleep, toDisplayError } from '@/global/utils';
import { createFileFormData, uploadFileRequest } from '@/global/utils/form';
import CLINICAL_SUBMISSION_QUERY from '@/gql/clinical/CLINICAL_SUBMISSION_QUERY';
import SIGN_OFF_SUBMISSION_MUTATION from '@/gql/clinical/SIGN_OFF_SUBMISSION_MUTATION';
import VALIDATE_SUBMISSION_MUTATION from '@/gql/clinical/VALIDATE_SUBMISSION_MUTATION';
import {
	useAppConfigContext,
	useAuthContext,
	useClinicalMutation,
	useClinicalQuery,
	useCommonToasters,
	useGlobalLoader,
	useSubmissionSystemStatus,
	useToaster,
	useUrlQueryState,
	useUserConfirmationModalState,
} from '@/hooks';
import { css } from '@emotion/react';
import {
	ColumnDef,
	Loader,
	NOTIFICATION_VARIANTS,
	NotificationVariant,
	Table,
	Typography,
} from '@icgc-argo/uikit';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Container } from 'react-grid-system';
import { useMutation } from 'react-query';
import urlJoin from 'url-join';
import { parseGQLResp } from '../data';
import {
	ClinicalEntity,
	ClinicalSubmissionError,
	ErrorTableColumnProperties,
	ErrorTableColumns,
} from '../types';
import FilesNavigator from './FilesNavigator';
import Header from './Header';
import Instructions from './Instructions';
import SignOffValidationModal from './SignOffValidationModal';
import SubmissionSummaryTable from './SubmissionSummaryTable';

const ClinicalSubmission = ({ shortName }: { shortName: string }) => {
	const URL_QUERY_KEY = 'tab';
	const commonToaster = useCommonToasters();
	const [query] = useUrlQueryState(URL_QUERY_KEY);
	const [selectedClinicalEntityType, setEntityType] = useState(query);
	const router = useRouter();
	const pathname = usePathname();
	const { setGlobalLoading } = useGlobalLoader();
	const toaster = useToaster();
	const { CLINICAL_API_ROOT } = useAppConfigContext();
	const { egoJwt } = useAuthContext();

	useEffect(() => {
		const defaultQuery = '?tab=donor';
		if (query === '') {
			const url = `${pathname}${defaultQuery}`;
			router.replace(url);
		} else {
			setEntityType(query);
		}
	}, [query]);

	// page data query
	const {
		data: gqlData,
		loading: isLoading,
		refetch,
		updateQuery: updateClinicalSubmissionQuery,
	} = useClinicalQuery(CLINICAL_SUBMISSION_QUERY, {
		variables: {
			programShortName: shortName,
		},
	});

	const uploadClinicalSubmission = useMutation<Response, Response, FormData>(
		(formData) => {
			const url = urlJoin(CLINICAL_API_ROOT, getProgramPath(UPLOAD_CLINICAL_DATA, shortName));
			return uploadFileRequest(url, formData, egoJwt);
		},
		{
			onSuccess: async (data) => {
				/**
				 * these properties are not returned from the HTTP response for certain clinical entities
				 * example if there is a file error
				 * they are needed for GQL type completeness
				 */
				const propertiesNotReturnedFromServer = {
					batchName: '',
					creator: '',
					createdAt: '',
					stats: null,
					fileName: '',
				};
				const result = await data.json();

				const { programShortName, fileErrors, clinicalEntities, version } = result;
				const clinicalEntitiesWithMissingProperties = clinicalEntities.map((entity) => ({
					...propertiesNotReturnedFromServer,
					...entity,
				}));
				updateClinicalSubmissionQuery((previous) => ({
					...previous,
					clinicalSubmissions: {
						...previous.clinicalSubmissions,
						version,
						programShortName,
						fileErrors,
						clinicalEntities: clinicalEntitiesWithMissingProperties,
					},
				}));
			},
			onError: () => {
				commonToaster.unknownError();
			},
		},
	);

	const handleSubmissionFilesUpload = (files: FileList) => {
		const fileFormData = createFileFormData(files, 'clinicalFiles');
		return uploadClinicalSubmission.mutate(fileFormData);
	};

	const [validateSubmission] = useClinicalMutation(VALIDATE_SUBMISSION_MUTATION, {
		onCompleted: () => {
			//setSelectedClinicalEntityType(defaultClinicalEntityType);
		},
	});

	const [signOffSubmission] = useClinicalMutation(SIGN_OFF_SUBMISSION_MUTATION);

	const { isDisabled: isSubmissionSystemDisabled } = useSubmissionSystemStatus();

	/**
	 * Data
	 */
	const {
		clinicalState,
		clinicalFileErrors,
		clinicalEntities,
		clinicalVersion,
		isPendingApproval,
		updateInfo,
	} = parseGQLResp(gqlData);

	const allDataErrors = useMemo(
		() =>
			clinicalEntities.reduce<Array<ClinicalSubmissionError & { fileName: string }>>(
				(acc, entity) => [
					...acc,
					...entity.dataErrors.map((err) => ({
						...err,
						fileName: entity.fileName,
					})),
				],
				[],
			),
		[clinicalEntities],
	);

	const allDataWarnings = useMemo(
		() =>
			clinicalEntities.reduce<Array<ClinicalSubmissionError & { fileName: string }>>(
				(acc, entity) => [
					...acc,
					...entity.dataWarnings.map((err) => ({
						...err,
						fileName: entity.fileName,
					})),
				],
				[],
			),
		[clinicalEntities],
	);

	// File Errors
	const onErrorClose =
		(index: number) =>
		({ type }: { type: string }) => {
			if (type === 'CLOSE') {
				updateClinicalSubmissionQuery((previous) => ({
					...previous,
					clinicalSubmissions: {
						...previous.clinicalSubmissions,
						fileErrors: previous.clinicalSubmissions.fileErrors?.filter((_, i) => i !== index),
					},
				}));
			}
		};

	/**
	 * Submission data errors and warnings
	 */
	const getErrorColumns = (
		level: NotificationVariant,
	): {
		errorReportColumns: ErrorReportColumns[];
		errorTableColumns: ColumnDef<ErrorTableColumns>[];
	} => {
		const errorTableColumns: ErrorTableColumnProperties[] = [
			{
				accessorKey: 'fileName',
				header: 'File',
				maxSize: 150,
			},
			...getDefaultErrorTableColumns(level),
		];

		const errorReportColumns: ErrorReportColumns[] = errorTableColumns.map(
			({ accessorKey, header }) => ({
				header,
				id: accessorKey,
			}),
		);

		return { errorReportColumns, errorTableColumns };
	};

	// Errors
	const { errorReportColumns, errorTableColumns } = getErrorColumns(NOTIFICATION_VARIANTS.ERROR);
	const errorData = allDataErrors.map(toDisplayError);
	const ErrorTable = (
		<Table
			columns={errorTableColumns}
			data={errorData}
			{...errorNotificationTableProps}
			withPagination
			showPageSizeOptions
		/>
	);

	// Warnings
	const { errorReportColumns: warningReportColumns, errorTableColumns: warningTableColumns } =
		getErrorColumns(NOTIFICATION_VARIANTS.WARNING);
	const warningData = allDataWarnings.map(toDisplayError);
	const WarningTable = (
		<Table
			columns={warningTableColumns}
			data={warningData}
			{...errorNotificationTableProps}
			withPagination
			showPageSizeOptions
		/>
	);

	const {
		isModalShown: signOffModalShown,
		getUserConfirmation: getSignOffConfirmation,
		onConfirmed: onSignOffApproved,
		onCancel: onSignOffCanceled,
	} = useUserConfirmationModalState();

	if (isLoading) {
		return <Loader />;
	} else if (gqlData) {
		const hasDataWarning = !!allDataWarnings.length;
		const hasDataError = !!allDataErrors.length;
		const hasSchemaErrorsAfterMigration = clinicalState === 'INVALID_BY_MIGRATION';
		const hasSchemaError =
			clinicalEntities.length && clinicalEntities.some(({ schemaErrors }) => !!schemaErrors.length);
		const hasSomeEntity = clinicalEntities.some(({ records }) => !!records.length);

		/**
		 * Instruction Box
		 */
		// Instruction box state
		const isReadyForValidation = hasSomeEntity && !hasSchemaError && !hasSchemaErrorsAfterMigration;
		const isReadyForSignoff = isReadyForValidation && clinicalState === 'VALID';
		const isValidated = clinicalState !== 'OPEN';

		// Instruction box handlers
		const handleSubmissionValidation = async () => {
			try {
				await validateSubmission({
					variables: {
						programShortName: shortName,
						submissionVersion: clinicalVersion,
					},
				});
			} catch (err) {
				await refetch();
				commonToaster.unknownErrorWithReloadMessage();
			}
		};

		const handleSignOff = async () => {
			try {
				const userDidApprove = await getSignOffConfirmation();

				if (userDidApprove) {
					setGlobalLoading(true);
					await sleep();
					const { data: newData } = await signOffSubmission({
						variables: {
							programShortName: shortName,
							submissionVersion: clinicalVersion,
						},
					});

					if (newData.clinicalSubmissions.state === null) {
						router.push(PROGRAM_DASHBOARD_PATH.replace(PROGRAM_SHORT_NAME_PATH, shortName));
						setGlobalLoading(false);

						toaster.addToast({
							variant: 'SUCCESS',
							interactionType: 'CLOSE',
							title: 'Successful Clinical Submission!',
							content:
								'Your clinical data has been submitted. You will see the updates on your dashboard shortly.',
						});
					} else {
						setGlobalLoading(false);
					}
				}
			} catch (err) {
				await refetch();
				commonToaster.unknownErrorWithReloadMessage();
				setGlobalLoading(false);
			}
		};

		/**
		 * File Navigator
		 */
		// FileNavigator handlers
		// errors are client side only and not persisted, this updates GQL cache only
		const handleClearSchemaError = async (file: ClinicalEntity) => {
			updateClinicalSubmissionQuery((previous) => {
				return {
					...previous,
					clinicalSubmissions: {
						...previous.clinicalSubmissions,
						clinicalEntities: previous.clinicalSubmissions.clinicalEntities.map((entity) => {
							const clearedSchemaType = file.clinicalType;
							const currentEntityType = entity?.clinicalType || '';
							const currentEntitySchemaError = entity?.schemaErrors || [];
							return {
								...entity,
								schemaErrors:
									clearedSchemaType === currentEntityType ? [] : currentEntitySchemaError,
							};
						}),
					},
				};
			});
		};

		const setSelectedClinicalEntityType = () => null;

		return (
			<>
				{signOffModalShown && (
					<ModalPortal>
						<SignOffValidationModal
							hasUpdate
							clinicalEntities={clinicalEntities}
							onActionClick={onSignOffApproved}
							onCloseClick={onSignOffCanceled}
							onCancelClick={onSignOffCanceled}
						/>
					</ModalPortal>
				)}
				<div
					css={css`
						display: flex;
						flex-direction: column;
					`}
				>
					<Header
						clinicalEntities={clinicalEntities}
						clinicalState={clinicalState}
						clinicalVersion={clinicalVersion}
						refetch={refetch}
						updateQuery={updateClinicalSubmissionQuery}
						showProgress={true}
						programShortName={shortName}
					/>
					<ContentMain>
						<Container>
							<Instructions
								uploadEnabled={!isSubmissionSystemDisabled}
								signOffEnabled={!isSubmissionSystemDisabled && isReadyForSignoff}
								validationEnabled={
									!isSubmissionSystemDisabled && isReadyForValidation && !hasDataError
								}
								onUploadFileSelect={handleSubmissionFilesUpload}
								onValidateClick={handleSubmissionValidation}
								onSignOffClick={handleSignOff}
								clinicalTypes={clinicalEntities.map(({ clinicalType }) => clinicalType)}
							/>
						</Container>
						{isPendingApproval && (
							<Container
								css={css`
									padding: 24px;
								`}
							>
								<div
									css={css`
										padding-bottom: 8px;
										display: flex;
										justify-content: space-between;
										align-items: center;
									`}
								>
									<Typography
										variant="subtitle"
										color="primary"
										css={css`
											margin: 0px;
										`}
									>
										Submission Summary
									</Typography>
									<Typography variant="data" color="black" as="div">
										Signed off on <strong>{displayDateAndTime(updateInfo.updatedAt)}</strong> by{' '}
										<strong>{updateInfo.updatedBy}</strong>
									</Typography>
								</div>
								<SubmissionSummaryTable clinicalEntities={clinicalEntities} />
							</Container>
						)}

						{/* File errors */}
						{clinicalFileErrors.map(({ fileNames, message }, i) => {
							const title = `Files failed to upload: ${fileNames.join(', ')}`;
							return (
								<FileError
									key={i}
									fileError={{
										message,
										title,
									}}
									onClose={onErrorClose}
									index={i}
								/>
							);
						})}

						{/* Submimssion data errors */}
						{hasDataError && (
							<div
								id="error-submission-workspace"
								css={css`
									margin-top: 20px;
								`}
							>
								<ErrorNotification
									level={NOTIFICATION_VARIANTS.ERROR}
									title={`${errorData.length.toLocaleString()} error(s) found in submission workspace`}
									subtitle="Your submission cannot yet be signed off. Please correct the following errors and reupload the corresponding files."
									reportData={errorData}
									reportColumns={errorReportColumns}
									tableComponent={ErrorTable}
								/>
							</div>
						)}

						{/* Submission data warnings */}
						{hasDataWarning && (
							<div
								id="warning-submission-workspace"
								css={css`
									margin-top: 20px;
								`}
							>
								<ErrorNotification
									level={NOTIFICATION_VARIANTS.WARNING}
									title={`${warningData.length.toLocaleString()} warning(s) found in submission workspace`}
									subtitle="Your submission has the following warnings, check them to make sure the changes are as intended."
									reportData={warningData}
									reportColumns={warningReportColumns}
									tableComponent={WarningTable}
								/>
							</div>
						)}
						{/* Main clinical entity section */}
						<Container
							css={css`
								min-height: 100px;
								position: relative;
								padding: 0px;
								min-height: 350px;
								display: flex;
								flex: 1;
							`}
						>
							<FilesNavigator
								submissionState={clinicalState}
								clearDataError={handleClearSchemaError}
								fileStates={clinicalEntities}
								selectedClinicalEntityType={selectedClinicalEntityType}
								onFileSelect={setSelectedClinicalEntityType}
								submissionVersion={clinicalVersion}
								programShortName={shortName}
								refetchClinicalSubmission={refetch}
							/>
						</Container>
					</ContentMain>
				</div>
			</>
		);
	} else {
		return <></>;
	}
};

export default ClinicalSubmission;
