import { CellContentCenter } from "@/app/components/Table/common";
import { css } from "@emotion/react";
import { get } from "lodash";
import { FILE_STATE_COLORS } from "./StatsArea";
import { FileRecord } from "./types";

const StatusColumCell = ({ original }: { original: FileRecord }) => {
  const hasError = recordHasError(original);
  const hasUpdate = rowHasUpdate(original);
  const isNew = stats?.new.some((row) => row === original?.row);
  return (
    isSubmissionValidated && (
      <CellContentCenter
        css={css`
          display: flex;
          justify-content: space-around;
        `}
      >
        <StarIcon
          fill={
            hasError
              ? FILE_STATE_COLORS.ERROR
              : hasUpdate
              ? FILE_STATE_COLORS.UPDATED
              : isNew
              ? FILE_STATE_COLORS.NEW
              : FILE_STATE_COLORS.NONE
          }
        />
        {isDiffPreview && hasUpdate && <div>old</div>}
      </CellContentCenter>
    )
  );
};

const DataFieldCell = ({
  original,
  fieldName,
}: {
  original: FileRecord;
  fieldName: string;
}) => {
  const originalFieldName = original[fieldName];
  return isDiffPreview && rowHasUpdate(original) ? (
    <div
      css={css`
        height: 100%;
        display: flex;
        flex-direction: column;
        & > div {
          margin-top: 5px;
          margin-bottom: 5px;
          flex: 1;
        }
      `}
    >
      <div>{originalFieldName}</div>
      <div>
        {get(
          file.dataUpdates.find(
            (u) => u?.field === fieldName && u.row === original?.row,
          ),
          "oldValue",
          originalFieldName,
        )}
      </div>
    </div>
  ) : (
    <>{originalFieldName}</>
  );
};
