import { Progress, ProgressStatus } from "@icgc-argo/uikit";
import { FC } from "react";

type ProgressBarProps = {
  isSubmissionSystemDisabled: boolean;
  hasClinicalRegistration: boolean;
  hasErrors: boolean;
};

const ProgressBar: FC<ProgressBarProps> = ({
  isSubmissionSystemDisabled,
  hasClinicalRegistration,
  hasErrors,
}) => {
  const progressStates: {
    upload: ProgressStatus;
    register: ProgressStatus;
  } = {
    upload: isSubmissionSystemDisabled
      ? "locked"
      : hasClinicalRegistration
      ? "success"
      : hasErrors
      ? "error"
      : "disabled",
    register: isSubmissionSystemDisabled
      ? "locked"
      : hasClinicalRegistration
      ? "pending"
      : hasErrors
      ? "disabled"
      : "disabled",
  };
  return (
    <Progress>
      <Progress.Item state={progressStates.upload} text="Upload" />
      <Progress.Item state={progressStates.register} text="Register" />
    </Progress>
  );
};

export default ProgressBar;
