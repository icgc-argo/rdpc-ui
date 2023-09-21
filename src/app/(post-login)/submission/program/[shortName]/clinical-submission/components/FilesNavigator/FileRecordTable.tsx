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
  SubmissionInfoArea,
  TableInfoHeaderContainer,
} from "@/app/components/Table/common";
import { css } from "@/lib/emotion";
import { Table, useTheme } from "@icgc-argo/uikit";
import get from "lodash/get";
import { CSSProperties, ComponentProps, createRef } from "react";
import { ClinicalSubmissionEntity } from "../../types";
import StatsArea from "./StatsArea";
import { FileRecord } from "./types";

const REQUIRED_FILE_ENTRY_FIELDS = {
  ROW_INDEX: "rowIndex",
};

const FileRecordTable = ({
  file,
  submissionData,
  isPendingApproval,
  isSubmissionValidated,
}: {
  isPendingApproval: boolean;
  isSubmissionValidated: boolean;
  file: ClinicalSubmissionEntity;
  submissionData?: ComponentProps<typeof SubmissionInfoArea>;
}) => {
  // const { shortName: programShortName } = usePageQuery<{ shortName: string }>();
  // const { egoJwt, permissions } = useAuthContext();
  // const isDiffPreview = useMemo(
  //   () =>
  //     (isDccMember(permissions) ||
  //       isDataSubmitter({ permissions, programId: programShortName })) &&
  //     isPendingApproval,
  //   [egoJwt, isPendingApproval],
  // );

  const theme = useTheme();
  const { records, stats, dataWarnings } = file;
  const fields = get(records, "fields", []);
  // const sortedRecords = orderBy(
  //   records,
  //   !(isDccMember(permissions) && isPendingApproval)
  //     ? REQUIRED_FILE_ENTRY_FIELDS.ROW
  //     : (r) => {
  //         const priority = (() => {
  //           switch (true) {
  //             case file.stats.updated.some((i) => i === r.row):
  //               return 0;
  //             case file.stats.new.some((i) => i === r.row):
  //               return 1;
  //             default:
  //               return records.length;
  //           }
  //         })();
  //         return `${priority}::${r.row}`;
  //       },
  // );
  const sortedRecords = records;
  const containerRef = createRef<HTMLDivElement>();
  const isDiffPreview = false;

  const recordHasError = (record: FileRecord) =>
    stats?.errorsFound.some((row) => row === record?.row);

  const rowHasUpdate = (record: FileRecord) =>
    stats?.updated.some((row) => row === record?.row);

  const cellHasUpdate = (cell: { row: FileRecord; field: string }) =>
    file.dataUpdates.some(
      (update) => update?.field === cell.field && update.row === cell.row?.row,
    );

  const recordHasWarning = (record: FileRecord) =>
    dataWarnings.some((dw) => dw?.row === record?.row);

  return (
    <div
      ref={containerRef}
      css={css`
        margin: 5px 10px;
        .updateRow + .updateRow {
          border-top: solid 1px ${theme.colors.grey_2};
        }
      `}
    >
      <TableInfoHeaderContainer
        left={
          <StatsArea
            isSubmissionValidated={isSubmissionValidated}
            total={records.length}
            fileStat={{
              errorCount: file.stats.errorsFound.length,
              newCount: file.stats.new.length,
              noUpdateCount: file.stats.noUpdate.length,
              updateCount: file.stats.updated.length,
            }}
          />
        }
        right={<SubmissionInfoArea {...submissionData} />}
      />
      <Table
        getTdProps={(
          _,
          row: { original: FileRecord },
          column: { id: string },
        ) =>
          ({
            style:
              isPendingApproval &&
              cellHasUpdate({ row: row.original, field: column.id })
                ? {
                    background: theme.colors.accent3_3,
                  }
                : {},
          }) as { style: CSSProperties }
        }
        getTrProps={(_, { original }: { original: FileRecord }) =>
          ({
            style: recordHasError(original)
              ? {
                  background: theme.colors.error_4,
                }
              : recordHasWarning(original)
              ? {
                  background: theme.colors.warning_4,
                }
              : isPendingApproval && rowHasUpdate(original)
              ? {
                  background: theme.colors.accent3_4,
                }
              : {},
          }) as { style: CSSProperties }
        }
        getTrGroupProps={(_, { original }: { original: FileRecord }) =>
          isPendingApproval && rowHasUpdate(original)
            ? {
                className: `updateRow`, // append this classname so parent div's css can apply style
              }
            : {}
        }
        columns={tableColumns}
        data={tableData}
        showPagination
      />
    </div>
  );
};

export default FileRecordTable;
