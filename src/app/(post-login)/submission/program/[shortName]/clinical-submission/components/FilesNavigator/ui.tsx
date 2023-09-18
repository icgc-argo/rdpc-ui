import { toDisplayError } from "@/global/utils";
import { css } from "@/lib/emotion";
import { ContentPlaceholder, NOTIFICATION_VARIANTS } from "@icgc-argo/uikit";

export const NoContentPlaceholder = () => (
  <div
    css={css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    `}
  >
    <ContentPlaceholder
      title="You do not have any data uploaded."
      subtitle="Follow the instructions above to get started."
    />
  </div>
);

export const ErrorBox = ({ onErrorClearClick, errors, displayName }) => (
  <div
    id="error-submit-clinical-data"
    css={css`
      padding: 16px;
    `}
  >
    <ErrorNotification
      level={NOTIFICATION_VARIANTS.ERROR}
      onClearClick={onErrorClearClick}
      title={`${
        errors.length
      } error(s) found in uploaded ${displayName.toLowerCase()} file`}
      errors={errors.map(toDisplayError)}
      subtitle={
        "Your file cannot be processed. Please correct the following errors and reupload your file."
      }
      columnConfig={getDefaultColumns(NOTIFICATION_VARIANTS.ERROR)}
    />
  </div>
);
