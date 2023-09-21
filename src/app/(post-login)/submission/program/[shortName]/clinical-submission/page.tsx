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
import CLINICAL_SUBMISSION_QUERY from "@/app/gql/CLINICAL_SUBMISSION_QUERY";
import { useAppConfigContext } from "@/app/hooks/AppProvider";
import useUrlQueryState from "@/app/hooks/useURLQueryState";
import { notNull } from "@/global/utils";
import { css } from "@/lib/emotion";
import { useQuery } from "@apollo/client";
import { Button } from "@icgc-argo/uikit";
import { useEffect, useState } from "react";
import urlJoin from "url-join";
import FilesNavigator from "./components/FilesNavigator";
import Instructions from "./components/Instructions";
import ProgressBar from "./components/ProgressBar";
import SubmissionSummaryTable from "./components/SummaryTable";
import { getFileNavigatorFiles } from "./data";

export const URL_QUERY_KEY = "tab";
const ClinicalSubmission = ({
  params: { shortName },
}: {
  params: { shortName: string };
}) => {
  const [query] = useUrlQueryState(URL_QUERY_KEY);
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
  const { data, loading: isLoading } = useQuery(CLINICAL_SUBMISSION_QUERY, {
    variables: {
      shortName,
    },
  });
  const clinicalState = data?.clinicalSubmissions.state;
  const clinicalEntities =
    data?.clinicalSubmissions.clinicalEntities?.filter(notNull) || [];

  // Instruction box
  // Instruction box state
  const isSubmissionSystemDisabled = false;
  const isReadyForSignoff = false;
  const isReadyForValidation = true;
  const hasDataError = false;
  const isValidated = true;
  const submissionVersion = "111";
  // Instruction box handlers
  const handleSubmissionFilesUpload = () => new Promise(() => true);
  const handleSubmissionValidation = () => new Promise(() => true);
  const handleSignOff = () => new Promise(() => true);
  const handleSubmissionClear = () => new Promise(() => true);

  // FileNavigator
  // FileNavigator state
  const fileNavigatorFiles = data ? getFileNavigatorFiles(data) : [];
  const [selectedClinicalEntityType, setEntityType] = useState(query);
  // FileNavigator handlers
  const handleClearSchemaError = () => new Promise(() => true);
  const setSelectedClinicalEntityType = () => null;

  if (data?.clinicalSubmissions === undefined) {
    return <div> no data</div>;
  } else {
    return isLoading ? (
      <div> loading ... </div>
    ) : (
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
          >
            <div
              css={css`
                flex: 1;
                display: flex;
                justify-content: space-between;
              `}
            >
              <ProgressBar
                clinicalEntities={data?.clinicalSubmissions.clinicalEntities}
                clinicalState={data?.clinicalSubmissions.state}
              />
              <Button
                variant="text"
                css={css`
                  margin-right: 10px;
                `}
                disabled={isSubmissionSystemDisabled || !submissionVersion}
                onClick={handleSubmissionClear}
              >
                Clear submission
              </Button>
            </div>
          </ContentHeader>
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
              // clinicalTypes={data.clinicalSubmissions.clinicalEntities.map(
              //   ({ clinicalType }) => clinicalType,
              // )}
              clinicalTypes={["a", "b"]}
            />
            <SubmissionSummaryTable
              clinicalEntities={data.clinicalSubmissions.clinicalEntities}
            />

            <FilesNavigator
              submissionState={data.clinicalSubmissions.state}
              clearDataError={handleClearSchemaError}
              fileStates={fileNavigatorFiles}
              selectedClinicalEntityType={selectedClinicalEntityType}
              onFileSelect={setSelectedClinicalEntityType}
              submissionVersion={data.clinicalSubmissions.version}
              programShortName={shortName}
            />
          </ContentMain>
        </div>
      </>
    );
  }
};

export default ClinicalSubmission;
