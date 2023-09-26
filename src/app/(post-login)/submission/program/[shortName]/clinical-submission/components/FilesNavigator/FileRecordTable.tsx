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
import { css, useTheme } from "@/lib/emotion";
import { Table } from "@icgc-argo/uikit";
import { ComponentProps } from "react";
import { ClinicalSubmissionEntityFile } from "../types";
import StatsArea from "./StatsArea";
import { getTableColumns, getTableData } from "./tableConfig";

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
  file: ClinicalSubmissionEntityFile;
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
  const isDiffPreview = true;

  const theme = useTheme();

  const { records, stats, dataWarnings } = file;

  const fields: ClinicalSubmissionEntityFile["records"][0]["fields"] =
    records.length ? records[0].fields : [];

  // const sortedRecords = orderBy(
  //   records,
  //   !(isDccMember(permissions) && isPendingApproval)
  //     ? REQUIRED_FILE_ENTRY_FIELDS.ROW_INDEX
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

  const tableColumns = getTableColumns(
    file,
    isPendingApproval,
    isSubmissionValidated,
    isDiffPreview,
  );
  const tableData = getTableData(file);
  console.log("table data", tableData);

  return (
    <div
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
              errorCount: stats.errorsFound.length,
              newCount: stats.new.length,
              noUpdateCount: stats.noUpdate.length,
              updateCount: stats.updated.length,
            }}
          />
        }
        right={<SubmissionInfoArea {...submissionData} />}
      />
      <Table
        columns={tableColumns}
        data={tableData}
        enableSorting
        showPageSizeOptions
        withHeaders
        withPagination
        withStripes
      />
    </div>
  );
};

export default FileRecordTable;
