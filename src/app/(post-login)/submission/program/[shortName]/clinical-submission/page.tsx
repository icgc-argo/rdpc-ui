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
import CLEAR_CLINICAL_SUBMISSION from "@/app/gql/CLEAR_CLINICAL_SUBMISSION";
import CLINICAL_SUBMISSION_QUERY from "@/app/gql/CLINICAL_SUBMISSION_QUERY";
import UPLOAD_CLINICAL_SUBMISSION_MUTATION from "@/app/gql/UPLOAD_CLINICAL_SUBMISSION_MUTATION";
import UPLOAD_REGISTRATION_MUTATION from "@/app/gql/UPLOAD_REGISTRATION_MUTATION";
import { useAppConfigContext } from "@/app/hooks/AppProvider";
import useCommonToasters from "@/app/hooks/useCommonToasters";
import { useSubmissionSystemStatus } from "@/app/hooks/useSubmissionSystemStatus";
import useUrlQueryState from "@/app/hooks/useURLQueryState";
import { css } from "@/lib/emotion";
import { useMutation, useQuery } from "@apollo/client";
import { DnaLoader } from "@icgc-argo/uikit";
import { useEffect, useMemo, useState } from "react";
import urlJoin from "url-join";
import FilesNavigator from "./components/FilesNavigator";
import Instructions from "./components/Instructions";
import SubmissionSummaryTable from "./components/SummaryTable";
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

  // data
  const { clinicalState, clinicalEntities, clinicalVersion } =
    parseGQLResp(gqlData);

  const allDataErrors = useMemo(
    () =>
      clinicalEntities.reduce(
        (acc, entity) => [
          ...acc,
          ...entity.dataErrors.map((err) => ({
            ...err,
            fileName: entity.batchName,
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
    const handleClearSchemaError = () => new Promise(() => true);
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
            <SubmissionSummaryTable clinicalEntities={clinicalEntities} />

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
