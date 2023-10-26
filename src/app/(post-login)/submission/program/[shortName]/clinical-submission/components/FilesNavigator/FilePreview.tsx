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

import { useSubmissionSystemStatus } from "@/app/hooks/useSubmissionSystemStatus";
import { css } from "@/lib/emotion";
import { Button, Typography } from "@icgc-argo/uikit";
import { FC } from "react";
import { ClinicalEntity, ClinicalSubmission } from "../../types";
import FileRecordTable from "./FileRecordTable";

type FilePreviewProps = {
  file: ClinicalEntity;
  submissionState: ClinicalSubmission["clinicalVersion"];
  clearSubmission: (fileType: string) => void;
};
const FilePreview: FC<FilePreviewProps> = ({
  file,
  submissionState,
  clearSubmission,
}) => {
  const { isDisabled: isSubmissionSystemDisabled } =
    useSubmissionSystemStatus();

  const isPendingApproval = submissionState === "PENDING_APPROVAL";

  const isSubmissionValidated = [
    "INVALID",
    "VALID",
    "PENDING_APPROVAL",
  ].includes(`${submissionState}`);

  const { displayName, clinicalType, fileName, creator = "", createdAt } = file;

  const onClearClick = (clinicalType: string) => async () => {
    await clearSubmission(clinicalType);
  };

  return (
    <>
      <div>
        <div
          css={css`
            padding: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
          `}
        >
          <Typography
            variant="subtitle2"
            color="primary"
            as="h2"
            css={css`
              margin: 0px;
              margin-left: 10px;
            `}
          >
            {displayName} File Preview
          </Typography>
          {!isPendingApproval && (
            <Button
              variant="text"
              size="sm"
              onClick={onClearClick(clinicalType)}
              disabled={isSubmissionSystemDisabled}
            >
              clear
            </Button>
          )}
        </div>
        <FileRecordTable
          isSubmissionValidated={isSubmissionValidated}
          isPendingApproval={isPendingApproval}
          file={file}
          submissionData={{
            fileName,
            creator,
            createdAt,
          }}
        />
      </div>
    </>
  );
};
export default FilePreview;
