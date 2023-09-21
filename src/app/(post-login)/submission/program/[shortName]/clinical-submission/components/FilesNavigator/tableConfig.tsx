import { CellContentCenter } from "@/app/components/Table/common";
import { toDisplayRowIndex } from "@/global/utils";
import { css } from "@emotion/react";
import { FILE_STATE_COLORS } from "./StatsArea";
import { FileRecord } from "./types";

const tableColumns: TableColumnConfig<FileRecord>[] = [
  {
    id: REQUIRED_FILE_ENTRY_FIELDS.ROW,
    Cell: ({ original }) => (
      <CellContentCenter
        css={
          rowHasUpdate(original)
            ? css`
                justify-content: flex-start;
                padding-top: 5px;
              `
            : css``
        }
      >
        {toDisplayRowIndex(original.row)}
      </CellContentCenter>
    ),
    Header: "Line #",
    resizable: false,
    width: 70,
  },
  {
    id: "status",
    Cell: StatusColumCell,
    accessor: "status",
    resizable: false,
    Header: (
      <CellContentCenter>
        <StarIcon fill={FILE_STATE_COLORS.NONE} />
      </CellContentCenter>
    ),
    sortMethod: (a: FileRecord["status"], b: FileRecord["status"]) => {
      const priorities = {
        ERROR: 1,
        UPDATE: 2,
        NEW: 3,
        NONE: 4,
      } as { [k in FileRecord["status"]]: number };
      return priorities[a] - priorities[b];
    },
    width: 50,
  },
  ...fields.map(
    ({ name: fieldName }) =>
      ({
        accessor: fieldName,
        Header: fieldName,
        Cell: ({ original }) => (
          <DataFieldCell original={original} fieldName={fieldName} />
        ),
      }) as (typeof tableColumns)[0],
  ),
];

const tableData = sortedRecords.map(
  (record) =>
    record?.fields.reduce(
      (acc, { name, value }) => ({ ...acc, [name]: value }),
      {
        row: record.row,
        status: (() => {
          switch (true) {
            case stats?.updated.some((i) => i === record.row):
              return "UPDATE";
            case stats?.errorsFound.some((i) => i === record.row):
              return "ERROR";
            case stats?.new.some((i) => i === record.row):
              return "NEW";
            default:
              return "NONE";
          }
        })(),
      },
    ),
);
