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

import {
  CellContentCenter,
  DataTableStarIcon,
} from "@/app/components/Table/common";
import { toDisplayRowIndex } from "@/global/utils";
import { ColumnDef, Row, css } from "@icgc-argo/uikit";
import {
  ClinicalEntity,
  ClinicalSubmissionError,
  ClinicalSubmissionRecord,
  Stats,
} from "../../types";
import { FILE_STATE_COLORS } from "./StatsArea";
import {
  CellStatusDisplay,
  DataFieldCell,
  StatusColumnCell,
} from "./TableCells";
import { FileRecord } from "./types";

type FileRecordTableProps = { row: { original: FileRecord } };

// util
export const recordHasError = (original: FileRecord, stats: Stats) =>
  stats?.errorsFound.some((row) => row === original.rowIndex);

export const rowHasUpdate = (original: FileRecord, stats: Stats) =>
  stats?.updated.some((row) => row === original.rowIndex);

export const cellHasUpdate = ({
  original,
  field,
  dataUpdates,
}: {
  original: FileRecord;
  field: string;
  dataUpdates: any;
}) =>
  Array.isArray(dataUpdates) &&
  dataUpdates.some(
    (update) => update.field === field && update.row === original.rowIndex,
  );

export const recordHasWarning = (
  original: FileRecord,
  dataWarnings: ClinicalSubmissionError[],
) =>
  Array.isArray(dataWarnings) &&
  dataWarnings.some((warning) => warning.row === original.rowIndex);

type GetTableColumns = (
  file: ClinicalEntity,
  isPendingApproval: boolean,
  isSubmissionValidated: boolean,
  isDiffPreview: boolean,
) => ColumnDef<FileRecord>[];
export const getTableColumns: GetTableColumns = (
  file,
  isPendingApproval,
  isSubmissionValidated,
  isDiffPreview,
) => {
  const { stats, records, dataUpdates } = file;
  const directlyMappedFields = records[0].fields.map(({ name: fieldName }) => ({
    accessorKey: fieldName,
    header: fieldName,
    cell: ({ row: { original } }: FileRecordTableProps) => (
      <CellStatusDisplay original={original} field={fieldName}>
        <DataFieldCell
          original={original}
          fieldName={fieldName}
          isDiffPreview={isDiffPreview}
          file={file}
          stats={stats}
        />
      </CellStatusDisplay>
    ),
  }));

  const cols: ColumnDef<FileRecord>[] = [
    {
      accessorKey: "rowIndex",
      cell: ({ row: { original } }: FileRecordTableProps) => (
        <CellStatusDisplay
          original={original}
          isPendingApproval={isPendingApproval}
          stats={stats}
          dataUpdates={dataUpdates}
        >
          <CellContentCenter
            css={
              rowHasUpdate(original, stats) &&
              css`
                justify-content: flex-start;
                padding-top: 5px;
              `
            }
          >
            {toDisplayRowIndex(original.rowIndex)}
          </CellContentCenter>
        </CellStatusDisplay>
      ),

      enableResizing: false,
      header: "Line #",
      size: 70,
    },
    {
      id: "status",
      accessorKey: "status",
      cell: ({ row: { original } }: FileRecordTableProps) => (
        <CellStatusDisplay original={original} field="status">
          <StatusColumnCell
            original={original}
            stats={stats}
            isDiffPreview={isDiffPreview}
            isSubmissionValidated={isSubmissionValidated}
          />
        </CellStatusDisplay>
      ),
      enableResizing: false,

      header: () => (
        <CellContentCenter>
          <DataTableStarIcon fill={FILE_STATE_COLORS.NONE} />
        </CellContentCenter>
      ),
      size: 50,
      sortingFn: (a: Row<FileRecord>, b: Row<FileRecord>) => {
        const sortA = a.original.status;
        const sortB = b.original.status;
        const priorities: { [k in FileRecord["status"]]: number } = {
          ERROR: 1,
          UPDATE: 2,
          NEW: 3,
          NONE: 4,
        };
        return priorities[sortA] - priorities[sortB];
      },
    },
    ...directlyMappedFields,
  ].map((column) => ({
    ...column,
    meta: {
      customCell: true,
    },
  }));
  return cols;
};

const getStatus = (record: ClinicalSubmissionRecord, stats: Stats) => {
  if (stats.updated.some((i) => i === record.row)) {
    return "UPDATE";
  } else if (stats.errorsFound.some((i) => i === record.row)) {
    return "ERROR";
  } else if (stats.new.some((i) => i === record.row)) {
    return "NEW";
  } else {
    return "NONE";
  }
};

type GetTableData = (file: ClinicalEntity) => FileRecord[];
export const getTableData: GetTableData = (file) => {
  const { stats, records } = file;
  return records.map((record) => {
    const recordFields = record.fields.reduce((acc, { name, value }) => ({
      ...acc,
      [name]: value,
    }));
    const { row } = record;
    const status = getStatus(record, stats);
    return {
      rowIndex: row,
      status,
      ...recordFields,
    };
  });
};
