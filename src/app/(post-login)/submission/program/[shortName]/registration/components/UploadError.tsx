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

import { ClinicalRegistrationError } from "@/__generated__/graphql";
import TableHeader from "@/app/(post-login)/submission/program-table/Header";
import { exportToTsv, toDisplayError } from "@/global/utils";
import { css, useTheme } from "@/lib/emotion";
import {
  Button,
  ColumnDef,
  Icon,
  NOTIFICATION_VARIANTS,
  Notification,
  NotificationVariant,
  Table,
} from "@icgc-argo/uikit";
import union from "lodash/union";
import { ComponentProps, FC, ReactNode, createRef } from "react";

const getDefaultColumns = (
  variantText: string,
): ColumnDef<{
  type: string;
  row: number;
  field: string;
  value: string;
  message: string;
  sampleId: string;
  donorId: string;
  specimenId: string;
}>[] => {
  return [
    {
      accessorKey: "row",
      header: () => <TableHeader>Line #</TableHeader>,
      maxSize: 70,
    },
    {
      accessorKey: "donorId",
      header: () => <TableHeader> Submitter Donor ID</TableHeader>,
      maxSize: 160,
    },
    {
      accessorKey: "field",
      header: () => <TableHeader>{`Field with ${variantText}`}</TableHeader>,
      maxSize: 200,
    },
    {
      accessorKey: "value",
      header: () => <TableHeader>{`${variantText} Value`}</TableHeader>,
      maxSize: 130,
    },
    {
      accessorKey: "message",
      header: () => <TableHeader>{`${variantText} Description`}</TableHeader>,
    },
  ];
};

const onDownloadClick = () => {
  exportToTsv(errors, {
    exclude: union(tsvExcludeCols, ["__typename" as keyof Error]),
    order: columnConfig.map((entry) => entry.accessor),
    fileName: `${level}_report.tsv`,
    headerDisplays: columnConfig.reduce<{}>(
      (acc, { accessor, Header }) => ({
        ...acc,
        [accessor]: Header as string,
      }),
      {},
    ),
  });
};

type UploadErrorProps = {
  level: NotificationVariant;
  title: string;
  subtitle: ReactNode;
  errors: Array<ClinicalRegistrationError>;
  onClearClick?: ComponentProps<typeof Button>["onClick"];
  tsvExcludeCols?: Array<keyof Error>;
};
const UploadError: FC<UploadErrorProps> = ({
  level,
  title,
  errors,
  subtitle,
  onClearClick,
  tsvExcludeCols = [],
}) => {
  const theme = useTheme();
  const onDownloadClick = () => null;

  const formattedErrors = errors.map(toDisplayError);

  const variantText =
    level === NOTIFICATION_VARIANTS.ERROR ? "Error" : "Warning";

  const columnConfig = getDefaultColumns(variantText);

  const containerRef = createRef<HTMLDivElement>();

  return (
    <div
      css={css`
        borderRadius: 8px;
        boxShadow:  0 2px 4px 0 ${theme.colors.grey_2}
        border: solid 1px ${theme.colors.error_2};
        background-color: ${theme.colors.error_4};
      `}
    >
      <Notification
        variant={level}
        interactionType="NONE"
        title={
          <div
            css={css`
              display: flex;
              justify-content: space-between;
            `}
          >
            {title}
            <div
              css={css`
                display: flex;
              `}
            >
              <Button variant="secondary" size="sm" onClick={onDownloadClick}>
                <span
                  css={css`
                    display: flex;
                    align-items: center;
                  `}
                >
                  <Icon
                    name="download"
                    fill="accent2_dark"
                    height="12px"
                    css={css`
                      marginright: 5px;
                    `}
                  />
                  {`${variantText} `}
                  Report
                </span>
              </Button>
              {!!onClearClick && (
                <Button
                  isAsync
                  id="button-clear-selected-file-upload"
                  variant="text"
                  size="sm"
                  onClick={onClearClick}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        }
        contentProps={{
          css: css`
            overflow: hidden;
          `,
        }}
        content={
          <div
            ref={containerRef}
            css={css`
              margin-top: 10px;
              width: 100%;
            `}
          >
            <div>{subtitle}</div>
            <Table
              parentRef={containerRef}
              columns={columnConfig}
              // columns={columnConfig.map((col) => ({
              //   ...col,
              //   style: {
              //     whiteSpace: "pre-line",
              //     ...(col.style || {}),
              //   },
              // }))}
              data={formattedErrors}
              withPagination
              showPageSizeOptions
              withHeaders
            />
          </div>
        }
      />
    </div>
  );
};

export default UploadError;
