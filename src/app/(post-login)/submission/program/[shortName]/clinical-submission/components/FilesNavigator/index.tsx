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

import { useToaster } from "@/app/hooks/ToastProvider";
import useCommonToasters from "@/app/hooks/useCommonToasters";
import { useSubmissionSystemStatus } from "@/app/hooks/useSubmissionSystemStatus";
import { useMutation } from "@apollo/client";
import { ContentPlaceholder, css } from "@icgc-argo/uikit";
import {
  ClinicalEntities,
  ClinicalSubmission,
  ClinicalSubmissionState,
} from "../../types";

import CLEAR_CLINICAL_SUBMISSION from "@/app/gql/CLEAR_CLINICAL_SUBMISSION";

const FilesNavigator = ({
  fileStates,
  clearDataError,
  submissionState,
  selectedClinicalEntityType,
  onFileSelect,
  programShortName,
  submissionVersion,
}: {
  submissionState: ClinicalSubmissionState;
  fileStates: ClinicalEntities;
  clearDataError: (file: ClinicalSubmissionEntityFile) => Promise<any>;
  selectedClinicalEntityType: string;
  onFileSelect: (clinicalEntityType: string) => void;
  submissionVersion: ClinicalSubmission["version"];
  programShortName: ClinicalSubmission["programShortName"];
}) => {
  // toasts
  const commonToaster = useCommonToasters();
  const toaster = useToaster();

  // queries
  const [clearClinicalEntitySubmission] = useMutation(
    CLEAR_CLINICAL_SUBMISSION,
  );

  // const { refetch: refetchClinicalSubmission } =
  //   useClinicalSubmissionQuery(programShortName);

  // state
  const selectedFile = fileStates.find(
    (file) => file && file.clinicalType === selectedClinicalEntityType,
  );
  const isPendingApproval = submissionState === "PENDING_APPROVAL";
  const { isDisabled: isSubmissionSystemDisabled } =
    useSubmissionSystemStatus();
  const shouldShowError = !!selectedFile && !!selectedFile.schemaErrors.length;
  const isSubmissionValidated = [
    "INVALID",
    "VALID",
    "PENDING_APPROVAL",
  ].includes(`${submissionState}`);

  // display
  return (
    <ContentPlaceholder
      css={css`
        width: 100%;
      `}
    />
  );
};

//   ) : (
//     <div
//       css={css`
//         position: relative;
//         width: 100%;
//         display: flex;
//       `}
//     >
//       <VerticalTabsSection filesStates={fileStates} />

//       <Col style={{ position: "relative", overflow: "hidden" }}>
//         {shouldShowError ? (
//           <Error
//             errors={schema.errors}
//             displayName={schema.name}
//             onErrorClearClick={onErrorClearClick}
//           />
//         ) : !!selectedFile.records.length ? (
//           <>
//             <div
//               css={css`
//                 padding: 8px;
//                 display: flex;
//                 justify-content: space-between;
//                 align-items: center;
//               `}
//             >
//               <Typography
//                 variant="subtitle2"
//                 color="primary"
//                 as="h2"
//                 css={css`
//                   margin: 0px;
//                   margin-left: 10px;
//                 `}
//               >
//                 {selectedFile.displayName} File Preview
//               </Typography>
//               {!isPendingApproval && (
//                 <Button
//                   variant="text"
//                   size="sm"
//                   onClick={onClearClick(selectedFile.clinicalType)}
//                   disabled={isSubmissionSystemDisabled}
//                 >
//                   clear
//                 </Button>
//               )}
//             </div>
//             <FileRecordTable
//               isSubmissionValidated={isSubmissionValidated}
//               isPendingApproval={isPendingApproval}
//               file={selectedFile}
//               submissionData={{
//                 fileName: selectedFile.fileName,
//                 creator: selectedFile.creator,
//                 createdAt: selectedFile.createdAt,
//               }}
//             />
//           </>
//         ) : (
//           <NoContentPlaceholder />
//         )}
//       </Col>
//     </div>
//   );
// };

export default FilesNavigator;
