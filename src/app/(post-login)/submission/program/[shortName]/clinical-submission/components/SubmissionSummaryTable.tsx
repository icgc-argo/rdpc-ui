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

import { StatArea } from '@/components/Table/common';
import { ColumnDef, Table, TableCellWrapper, css, useTheme } from '@icgc-argo/uikit';
import { capitalize } from 'lodash';
import { createRef } from 'react';
import { ClinicalEntity, ClinicalEntityType } from '../types';
import { FILE_STATE_COLORS, RecordState } from './FilesNavigator/StatsArea';

type SubmissionSummaryStatus = {
	submissionSummaryStatus: string;
};

// This type allows us to have a subset of the GqlClinicalEntity properties as columns, but not any other columns.
//   A SubmissionSummaryStatus column is also allowed.
type SubmissionSummaryColumns = Partial<
	SubmissionSummaryStatus & {
		[k in ClinicalEntityType]: string;
	}
>;

const FIRST_COLUMN_ACCESSOR = 'submissionSummaryStatus';

const SubmissionSummaryTable = ({ clinicalEntities }: { clinicalEntities: ClinicalEntity[] }) => {
	const theme = useTheme();

	const newDataRow = clinicalEntities.reduce(
		(acc, entity) => ({
			...acc,
			[entity.clinicalType]: String(entity.stats?.new?.length || 0),
		}),
		{ [FIRST_COLUMN_ACCESSOR]: 'New' },
	);

	const updatedDataRow = clinicalEntities.reduce(
		(acc, entity) => ({
			...acc,
			[entity.clinicalType]: String(entity.stats?.updated?.length || 0),
		}),
		{ [FIRST_COLUMN_ACCESSOR]: 'Updated' },
	);

	const tableData: SubmissionSummaryColumns[] = [newDataRow, updatedDataRow];

	const containerRef = createRef<HTMLDivElement>();

	const tableColumns: ColumnDef<SubmissionSummaryColumns>[] = [
		{
			header: '',
			accessorKey: FIRST_COLUMN_ACCESSOR,
			size: 100,
			cell: ({ row: { index, original } }) => {
				const cellValue = original[FIRST_COLUMN_ACCESSOR];
				const cellValueColourMap =
					(cellValue?.toUpperCase() as RecordState) || FILE_STATE_COLORS.NONE;
				return (
					<TableCellWrapper
						css={css`
							background: ${index ? theme.colors.accent3_3 : theme.colors.accent2_4};
						`}
					>
						<StatArea.StarIcon fill={FILE_STATE_COLORS[cellValueColourMap]} />
						&nbsp;{cellValue}
					</TableCellWrapper>
				);
			},
			meta: {
				customCell: true,
			},
		},
		...clinicalEntities.map((entity) => ({
			accessorKey: entity.clinicalType,
			header: capitalize(entity.clinicalType.split('_').join(' ')),
			cell: ({ cell, row }: { cell: any; row: any }) => (
				<TableCellWrapper
					css={css`
						background: ${Number(cell.getValue())
							? row.index
								? theme.colors.accent3_3
								: theme.colors.accent2_4
							: 'transparent'};
					`}
				>
					{cell.getValue()}
				</TableCellWrapper>
			),
			meta: {
				customCell: true,
			},
		})),
	];

	return (
		<div
			css={css`
				width: 100%;
			`}
			ref={containerRef}
		>
			<Table
				columns={tableColumns}
				data={tableData}
				withHeaders
				enableColumnResizing
				withRowBorder
				withSideBorders
			/>
		</div>
	);
};

export default SubmissionSummaryTable;
