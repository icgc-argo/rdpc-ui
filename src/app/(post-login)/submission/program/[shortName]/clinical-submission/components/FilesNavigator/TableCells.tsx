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
import { css, useTheme } from "@/lib/emotion";
import { TableCellWrapper } from "@icgc-argo/uikit";
import { get } from "lodash";
import { FC, ReactNode } from "react";
import { ClinicalEntity, Stats } from "../../types";
import { FILE_STATE_COLORS } from "./StatsArea";
import {
  cellHasUpdate,
  recordHasError,
  recordHasWarning,
  rowHasUpdate,
} from "./tableConfig";
import { FileRecord } from "./types";

export const StatusColumnCell: FC<{
  original: FileRecord;
  stats: Stats;
  isSubmissionValidated: boolean;
  isDiffPreview: boolean;
}> = ({ original, stats, isSubmissionValidated, isDiffPreview }) => {
  const hasError = recordHasError(original, stats);
  const hasUpdate = rowHasUpdate(original, stats);
  const hasNewData = stats?.new.some((row) => row === original.rowIndex);
  return isSubmissionValidated ? (
    <CellContentCenter
      css={css`
        display: flex;
        justify-content: space-around;
      `}
    >
      <DataTableStarIcon
        fill={
          hasError
            ? FILE_STATE_COLORS.ERROR
            : hasUpdate
            ? FILE_STATE_COLORS.UPDATED
            : hasNewData
            ? FILE_STATE_COLORS.NEW
            : FILE_STATE_COLORS.NONE
        }
      />
      {isDiffPreview && hasUpdate && <div>old</div>}
    </CellContentCenter>
  ) : null;
};

function isValidFieldNameIndex(
  fieldName: any,
  file: FileRecord,
): fieldName is keyof FileRecord {
  return file.hasOwnProperty(fieldName);
}

export const DataFieldCell = ({
  original,
  fieldName,
  isDiffPreview,
  stats,
  file,
}: {
  original: FileRecord;
  fieldName: string;
  isDiffPreview: boolean;
  stats: Stats;
  file: ClinicalEntity;
}) => {
  if (isValidFieldNameIndex(fieldName, original)) {
    return isDiffPreview && rowHasUpdate(original, stats) ? (
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
        <div>{original[fieldName]}</div>
        <div>
          {get(
            file.dataUpdates.find(
              (u) => u.field === fieldName && u.row === original.rowIndex,
            ),
            "oldValue",
            original[fieldName],
          )}
        </div>
      </div>
    ) : (
      <>{original[fieldName]}</>
    );
  } else {
    return null;
  }
};

type CellStatusDisplayProps = {
  original: FileRecord;
  field?: string;
  isPendingApproval?: boolean;
  stats?: any;
  children?: ReactNode;
  dataUpdates?: any;
};
export const CellStatusDisplay: FC<CellStatusDisplayProps> = ({
  original,
  field = "",
  isPendingApproval,
  stats,
  children,
  dataUpdates,
}) => {
  const pendingApprovalRowUpdate =
    isPendingApproval && rowHasUpdate(original, stats);
  const { colors } = useTheme();
  const cellBackground =
    !isPendingApproval && cellHasUpdate({ original, field, dataUpdates })
      ? colors.accent3_3
      : recordHasError(original, stats)
      ? colors.error_4
      : recordHasWarning(original, stats)
      ? colors.warning_4
      : pendingApprovalRowUpdate
      ? colors.accent3_4
      : "transparent";
  const cellClassName = pendingApprovalRowUpdate
    ? `updateRow` // append this classname so parent div's css can apply style
    : "";
  return (
    <TableCellWrapper
      className={cellClassName}
      css={css`
        background: ${cellBackground};
      `}
    >
      {children}
    </TableCellWrapper>
  );
};
