/*
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
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

import { StatArea } from "@/app/components/Table/common";
import { ColumnDef, css, ThemeColorNames } from "@icgc-argo/uikit";
import { startCase } from "lodash";
import { createRef } from "react";
import { ClinicalEntities, ClinicalSubmission } from "../types";

export const FILE_STATE_COLORS: {
  [k: string]: keyof ThemeColorNames;
} = {
  ERROR: "error",
  WARNING: "warning",
  NEW: "accent2",
  NONE: "grey_1",
  UPDATED: "accent3_dark",
};

const defaultStats = {
  errorsFound: [],
  new: [],
  noUpdate: [],
  updated: [],
};

type Entry = {
  [k: string]: number | JSX.Element;
};

const FIRST_COLUMN_ACCESSOR = "__";

const getData = (clinicalEntities: ClinicalEntities) => {
  const newDataRow: Entry = {
    [FIRST_COLUMN_ACCESSOR]: (
      <>
        <StatArea.StarIcon fill={FILE_STATE_COLORS.NEW} />
        New
      </>
    ),
    ...clinicalEntities.reduce<{ [k: string]: string }>(
      (acc, entity) => ({
        ...acc,
        [entity.clinicalType]: String(
          (entity.stats || defaultStats).new.length,
        ),
      }),
      {},
    ),
  };

  const updatedDataRow: Entry = {
    [FIRST_COLUMN_ACCESSOR]: (
      <>
        <StatArea.StarIcon fill={FILE_STATE_COLORS.UPDATED} />
        Updated
      </>
    ),
    ...clinicalEntities.reduce<{ [k: string]: string }>(
      (acc, entity) => ({
        ...acc,
        [entity.clinicalType]: String(
          (entity?.stats || defaultStats).updated.length,
        ),
      }),
      {},
    ),
  };

  return [newDataRow, updatedDataRow];
};

const getColumns = (clinicalEntities: ClinicalEntities) => {
  const columns: ColumnDef<Entry>[] = [
    // this is the first column
    {
      accessorKey: FIRST_COLUMN_ACCESSOR,
      minSize: 100,
    },
    ...clinicalEntities.map((entity) => ({
      accessorKey: entity?.clinicalType,
      header: startCase(entity?.clinicalType.split("_").join(" ")),
    })),
  ];

  return columns;
};

const SubmissionSummaryTable = ({
  clinicalEntities,
}: {
  clinicalEntities: ClinicalSubmission["clinicalEntities"];
}) => {
  const containerRef = createRef<HTMLDivElement>();
  return (
    <div
      css={css`
        width: 100%;
      `}
      ref={containerRef}
    >
      table
    </div>
  );
};

export default SubmissionSummaryTable;

/**
 * 
 * 
 *    <Table
      //variant="STATIC"
      // getTdProps={(_, row, column) => {
      //   const isUpdateRow = row.index === 1;
      //   const isFirstColumn = column.id === FIRST_COLUMN_ACCESSOR;
      //   return {
      //     style: {
      //       background:
      //         row.original[column.id] > 0 || isFirstColumn
      //           ? isUpdateRow
      //             ? theme.colors.accent3_3
      //             : theme.colors.accent2_4
      //           : null,
      //     } as CSSProperties,
      //   };
      // }}
      // columns={getColumns(clinicalEntities)}
      //data={getData(clinicalEntities)}
      //resizable
      />
 */
