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
"use client";

import ContentHeader from "@/app/components/Content/ContentHeader";
import ContentMain from "@/app/components/Content/ContentMain";
import ErrorNotification, {
  ErrorReportColumns,
} from "@/app/components/ErrorNotification";
import {
  errorNotificationTableProps,
  getDefaultErrorTableColumns,
} from "@/app/components/ErrorNotification/ErrorNotificationDefaultTable";
import CLEAR_CLINICAL_SUBMISSION from "@/app/gql/CLEAR_CLINICAL_SUBMISSION";
import CLINICAL_SUBMISSION_QUERY from "@/app/gql/CLINICAL_SUBMISSION_QUERY";
import UPLOAD_CLINICAL_SUBMISSION_MUTATION from "@/app/gql/UPLOAD_CLINICAL_SUBMISSION_MUTATION";
import UPLOAD_REGISTRATION_MUTATION from "@/app/gql/UPLOAD_REGISTRATION_MUTATION";
import { useAppConfigContext } from "@/app/hooks/AppProvider";
import useCommonToasters from "@/app/hooks/useCommonToasters";
import { useSubmissionSystemStatus } from "@/app/hooks/useSubmissionSystemStatus";
import useUrlQueryState from "@/app/hooks/useURLQueryState";
import { toDisplayError } from "@/global/utils";
import { css } from "@/lib/emotion";
import { useMutation, useQuery } from "@apollo/client";
import {
  ColumnDef,
  DnaLoader,
  NOTIFICATION_VARIANTS,
  NotificationVariant,
  Table,
} from "@icgc-argo/uikit";
import { useEffect, useMemo, useState } from "react";
import urlJoin from "url-join";
import FileError from "../../../../../components/FileError";
import FilesNavigator from "./components/FilesNavigator";
import Instructions from "./components/Instructions";
import { parseGQLResp } from "./data";

export const URL_QUERY_KEY = "tab";

const ClinicalSubmission = ({
  params: { shortName },
}: {
  params: { shortName: string };
}) => {
  const commonToaster = useCommonToasters();
  const [query] = useUrlQueryState(URL_QUERY_KEY);
  const [selectedClinicalEntityType, setEntityType] = useState(query);

  useEffect(() => {
    setEntityType(query);
  }, [query]);

  // docs url
  const { DOCS_URL_ROOT } = useAppConfigContext();
  const helpUrl = urlJoin(
    DOCS_URL_ROOT,
    "/docs/submission/submitting-clinical-data",
  );

  // page data query
  const {
    data: gqlData,
    loading: isLoading,
    refetch,
    updateQuery: updateClinicalSubmissionQuery,
  } = useQuery(CLINICAL_SUBMISSION_QUERY, {
    variables: {
      shortName,
    },
  });

  // mutations
  const [clearClinicalSubmission] = useMutation(CLEAR_CLINICAL_SUBMISSION);
  const [uploadClinicalSubmission, mutationStatus] = useMutation(
    UPLOAD_CLINICAL_SUBMISSION_MUTATION,
    {
      onCompleted: (d) => {
        //setSelectedClinicalEntityType(defaultClinicalEntityType);
      },
      onError: (e) => {
        commonToaster.unknownError();
      },
    },
  );

  const handleSubmissionFilesUpload = (files: FileList) =>
    uploadClinicalSubmission({
      variables: {
        programShortName: shortName,
        files,
      },
    });

  const { isDisabled: isSubmissionSystemDisabled } =
    useSubmissionSystemStatus();

  /**
   * Data
   */
  const {
    clinicalState,
    clinicalFileErrors,
    clinicalEntities,
    clinicalVersion,
  } = parseGQLResp(gqlData);

  const allDataErrors = useMemo(
    () =>
      clinicalEntities.reduce(
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
      clinicalEntities.reduce(
        (acc, entity) => [
          ...acc,
          ...entity.dataWarnings.map((err) => ({
            ...err,
            fileName: entity.batchName,
          })),
        ],
        [],
      ),
    [clinicalEntities],
  );

  //

  const [uploadFile, { loading: isUploading }] = useMutation(
    UPLOAD_REGISTRATION_MUTATION,

    {
      onError: (e) => {
        commonToaster.unknownError();
      },
    },
  );

  // File Errors
  const onErrorClose =
    (index: number) =>
    ({ type }) => {
      if (type === "CLOSE") {
        updateClinicalSubmissionQuery((previous) => ({
          ...previous,
          clinicalSubmissions: {
            ...previous.clinicalSubmissions,
            fileErrors: previous.clinicalSubmissions.fileErrors.filter(
              (_, i) => i !== index,
            ),
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
        accessorKey: "fileName",
        header: "File",
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
  const { errorReportColumns, errorTableColumns } = getErrorColumns(
    NOTIFICATION_VARIANTS.ERROR,
  );
  const errorData = allDataErrors.map(toDisplayError);
  const ErrorTable = (
    <Table
      columns={errorTableColumns}
      data={errorData}
      {...errorNotificationTableProps}
    />
  );

  // Warnings
  const {
    errorReportColumns: warningReportColumns,
    errorTableColumns: warningTableColumns,
  } = getErrorColumns(NOTIFICATION_VARIANTS.WARNING);
  const warningData = allDataWarnings.map(toDisplayError);
  const WarningTable = (
    <Table
      columns={warningTableColumns}
      data={warningData}
      {...errorNotificationTableProps}
    />
  );

  if (isLoading) {
    return (
      <div
        css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        `}
      >
        <DnaLoader />
      </div>
    );
  } else if (gqlData) {
    const hasDataWarning = !!allDataWarnings.length;
    const hasDataError = !!allDataErrors.length;
    const hasSchemaErrorsAfterMigration =
      clinicalState === "INVALID_BY_MIGRATION";
    const hasSchemaError =
      clinicalEntities.length &&
      clinicalEntities.some(({ schemaErrors }) => !!schemaErrors.length);
    const hasSomeEntity = clinicalEntities.some(
      ({ records }) => !!records.length,
    );

    // Instruction box
    // Instruction box state
    const isReadyForValidation =
      hasSomeEntity && !hasSchemaError && !hasSchemaErrorsAfterMigration;
    const isReadyForSignoff = isReadyForValidation && clinicalState === "VALID";
    const isValidated = clinicalState !== "OPEN";
    // Instruction box handlers

    const handleSubmissionValidation = () => new Promise(() => true);

    const handleSignOff = () => new Promise(() => true);

    // FileNavigator
    // FileNavigator handlers
    const handleClearSchemaError = async (file) => {
      await updateClinicalSubmissionQuery((previous) => ({
        ...previous,
        clinicalSubmissions: {
          ...previous.clinicalSubmissions,
          clinicalEntities: previous.clinicalSubmissions.clinicalEntities.map(
            (entity) => ({
              ...entity,
              schemaErrors:
                file.clinicalType === entity.clinicalType
                  ? []
                  : entity.schemaErrors,
            }),
          ),
        },
      }));
    };
    const setSelectedClinicalEntityType = () => null;

    return (
      <>
        <div
          css={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <ContentHeader
            breadcrumb={[shortName, "Submit Clinical Data"]}
            helpUrl={helpUrl}
          ></ContentHeader>
          <ContentMain>
            <Instructions
              uploadEnabled={!isSubmissionSystemDisabled}
              signOffEnabled={!isSubmissionSystemDisabled && isReadyForSignoff}
              validationEnabled={
                !isSubmissionSystemDisabled &&
                isReadyForValidation &&
                !hasDataError &&
                !isValidated
              }
              onUploadFileSelect={handleSubmissionFilesUpload}
              onValidateClick={handleSubmissionValidation}
              onSignOffClick={handleSignOff}
              clinicalTypes={clinicalEntities.map(
                ({ clinicalType }) => clinicalType,
              )}
            />

            {/* File errors */}
            {clinicalFileErrors.map(({ fileNames, message }, i) => (
              <FileError
                fileError={{
                  message,
                  title: `${fileNames.length} of ${(
                    "WHAT IS THIS" || []
                  ).length.toLocaleString()} files failed to upload: ${fileNames.join(
                    ", ",
                  )}`,
                }}
                onClose={onErrorClose}
                index={i}
              />
            ))}

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
            <FilesNavigator
              submissionState={clinicalState}
              clearDataError={handleClearSchemaError}
              fileStates={clinicalEntities}
              selectedClinicalEntityType={selectedClinicalEntityType}
              onFileSelect={setSelectedClinicalEntityType}
              submissionVersion={clinicalVersion}
              programShortName={shortName}
            />
          </ContentMain>
        </div>
      </>
    );
  }
};

export default ClinicalSubmission;
