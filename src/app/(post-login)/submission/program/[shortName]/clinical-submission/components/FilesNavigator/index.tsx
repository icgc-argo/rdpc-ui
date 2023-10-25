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

import CLEAR_CLINICAL_SUBMISSION from "@/app/gql/CLEAR_CLINICAL_SUBMISSION";
import { useToaster } from "@/app/hooks/ToastProvider";
import useCommonToasters from "@/app/hooks/useCommonToasters";
import { css } from "@/lib/emotion";
import { useMutation } from "@apollo/client";
import { Col } from "react-grid-system";
import { ClinicalEntity, ClinicalSubmission } from "../../types";
import FilePreview from "./FilePreview";
import VerticalTabsSection from "./Tabs";
import { ErrorBox, NoContentPlaceholder } from "./ui";

const FilesNavigator = ({
  fileStates,
  clearDataError,
  submissionState,
  selectedClinicalEntityType,
  onFileSelect,
  programShortName,
  submissionVersion,
}: {
  submissionState: ClinicalSubmission["clinicalState"];
  fileStates: ClinicalEntity[];
  clearDataError: (file: ClinicalEntity) => void;
  selectedClinicalEntityType: string;
  onFileSelect: (clinicalEntityType: string) => void;
  submissionVersion: ClinicalSubmission["clinicalVersion"];
  programShortName: string;
}) => {
  // toasts
  const commonToaster = useCommonToasters();
  const toaster = useToaster();

  // queries
  const [clearClinicalEntitySubmission] = useMutation(
    CLEAR_CLINICAL_SUBMISSION,
  );

  // state
  const selectedFile = fileStates.find(
    (file) => file && file.clinicalType === selectedClinicalEntityType,
  );

  const schemaErrors = selectedFile?.schemaErrors;

  const clearSubmission = async (fileType: string) => {
    try {
      await clearClinicalEntitySubmission({
        variables: {
          programShortName: programShortName || "",
          submissionVersion: submissionVersion || "",
          fileType,
        },
      });
      toaster.addToast({
        variant: "SUCCESS",
        interactionType: "CLOSE",
        title: "Cleared",
        content: `Uploaded ${fileType.toUpperCase()} file has been cleared.`,
      });
    } catch (err) {
      //await refetchClinicalSubmission();
      console.log("err", err);
      commonToaster.unknownErrorWithReloadMessage();
    }
  };

  const setSelectedClinicalEntityType = () => null;

  const onErrorClearClick = () => {
    if (selectedFile) {
      clearDataError(selectedFile);
    }
  };

  return (
    <div
      css={css`
        position: relative;
        width: 100%;
        display: flex;
      `}
    >
      <VerticalTabsSection
        fileStates={fileStates}
        selectedFile={selectedFile}
        onFileSelect={setSelectedClinicalEntityType}
      />

      <Col style={{ position: "relative", overflow: "hidden" }}>
        {schemaErrors?.length ? (
          <ErrorBox
            data={schemaErrors}
            selectedFile={selectedFile}
            onClearClick={onErrorClearClick}
          />
        ) : selectedFile?.records.length ? (
          <FilePreview
            file={selectedFile}
            {...{ clearSubmission, submissionState }}
          />
        ) : (
          <NoContentPlaceholder />
        )}
      </Col>
    </div>
  );
};

export default FilesNavigator;
