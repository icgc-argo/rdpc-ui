import { css, useTheme } from "@/lib/emotion";
import {
  Notification,
  NotificationInteraction,
  NotificationInteractionEvent,
} from "@icgc-argo/uikit";
import { FC } from "react";

type FileErrorProps = {
  fileError: { message: string; fileNames: string[] };
  index: number;
  onClose: (
    i: number,
  ) => ({
    type,
    event,
  }: {
    type: NotificationInteraction;
    event: NotificationInteractionEvent;
  }) => void;
};
const FileError: FC<FileErrorProps> = ({ fileError, index, onClose }) => {
  const theme = useTheme();
  return (
    <div
      className="error"
      css={css`
        > div {
          border: none;
          background: inherit;
        }
      `}
    >
      <Notification
        key={index}
        size="SM"
        variant="ERROR"
        interactionType="CLOSE"
        title={`File failed to upload: ${fileError?.fileNames.join(", ")}`}
        content={fileError?.message}
        onInteraction={onClose(index)}
      />
    </div>
  );
};

export default FileError;
