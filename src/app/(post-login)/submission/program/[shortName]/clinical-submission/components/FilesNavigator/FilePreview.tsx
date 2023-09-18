import { useSubmissionSystemStatus } from "@/app/hooks/useSubmissionSystemStatus";
import { css } from "@/lib/emotion";
import { Button, Typography } from "@icgc-argo/uikit";
import { FC } from "react";
import { ClinicalSubmissionEntity, ClinicalSubmissionState } from "../../types";
import FileRecordTable from "./FileRecordTable";
import { onClearClick } from "./handlers";

type FilePreivewProps = {
  file: ClinicalSubmissionEntity;
  submissionState: ClinicalSubmissionState;
};
const FilePreview: FC<FilePreivewProps> = ({ file, submissionState }) => {
  const { isDisabled: isSubmissionSystemDisabled } =
    useSubmissionSystemStatus();

  const isPendingApproval = submissionState === "PENDING_APPROVAL";

  const isSubmissionValidated = [
    "INVALID",
    "VALID",
    "PENDING_APPROVAL",
  ].includes(`${submissionState}`);

  const { displayName, clinicalType, fileName, creator, createdAt } = file;

  return (
    <>
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
    </>
  );
};
export default FilePreview;
