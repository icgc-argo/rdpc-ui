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
	StatArea as StatAreaDisplay,
	SubmissionInfoArea,
	TableInfoHeaderContainer,
} from '@/components/Table/common';
import { toDisplayRowIndex } from '@/global/utils/clinical';
import { ColumnDef, Icon, Table, css } from '@icgc-argo/uikit';
import memoize from 'lodash/memoize';
import { ComponentProps, FC, createRef } from 'react';
import { FileTableData } from './FilePreview';

const REQUIRED_FILE_ENTRY_FIELDS = {
	ROW: 'row',
	IS_NEW: 'isNew',
};

type FileStats = {
	newCount: number;
	existingCount: number;
};

const StarIcon = ({
	fill,
}: ComponentProps<typeof DataTableStarIcon> & {
	fill: 'accent2' | 'grey_1';
}) => <DataTableStarIcon fill={fill} />;

const StatsArea = (props: { stats?: FileStats }) => {
	const { stats } = props;
	return (
		<StatAreaDisplay.Container>
			<StatAreaDisplay.Section>
				{stats ? (stats.existingCount + stats.newCount).toLocaleString() : 0} Total
			</StatAreaDisplay.Section>
			<StatAreaDisplay.Section>
				<Icon name="chevron_right" fill="grey_1" width="8px" />
			</StatAreaDisplay.Section>
			<StatAreaDisplay.Section>
				<StatAreaDisplay.StatEntryContainer>
					<StatAreaDisplay.StarIcon fill="accent2" />
					{stats && stats.newCount.toLocaleString()} New
				</StatAreaDisplay.StatEntryContainer>
			</StatAreaDisplay.Section>
			<StatAreaDisplay.Section>
				<StatAreaDisplay.StatEntryContainer>
					<StatAreaDisplay.StarIcon fill="grey_1" />
					{stats && stats.existingCount.toLocaleString()} Already Registered
				</StatAreaDisplay.StatEntryContainer>
			</StatAreaDisplay.Section>
		</StatAreaDisplay.Container>
	);
};

const getColumnWidth = memoize<(keyString: string) => number>((keyString) => {
	const minWidth = 90;
	const maxWidth = 230;
	const spacePerChar = 9;
	const margin = 25;
	const targetWidth = keyString.length * spacePerChar + margin;
	return Math.max(Math.min(maxWidth, targetWidth), minWidth);
});

type FileTableProps = {
	records: FileTableData[];
	stats?: FileStats;
	submissionInfo: ComponentProps<typeof SubmissionInfoArea>;
};

const FileTable: FC<FileTableProps> = ({ records, stats, submissionInfo }) => {
	const containerRef = createRef<HTMLDivElement>();

	const r = records[0];
	const additionalFields = Object.values(REQUIRED_FILE_ENTRY_FIELDS);
	const remainingKeys = Object.keys(r) as Array<keyof FileTableData>;
	const originalCols: ColumnDef<FileTableData>[] = remainingKeys
		.filter((key) => !additionalFields.includes(key))
		.map((key) => ({
			id: key,
			accessor: key,
			cell: ({ row: { original } }) => original[key],
			header: key,
			minSize: getColumnWidth(key),
		}));

	const columns: ColumnDef<FileTableData>[] = [
		{
			header: 'Line #',
			id: REQUIRED_FILE_ENTRY_FIELDS.ROW,
			cell: ({ row: { original } }) => (
				<div
					css={css`
						width: 50px;
					`}
				>
					<CellContentCenter>{toDisplayRowIndex(original.row)}</CellContentCenter>
				</div>
			),
			accessorKey: 'row',
			minSize: 64,
		},
		{
			id: REQUIRED_FILE_ENTRY_FIELDS.IS_NEW,
			cell: ({ row: { original } }) => (
				<CellContentCenter>
					<StarIcon fill={original.isNew ? 'accent2' : 'grey_1'} />
				</CellContentCenter>
			),
			accessorKey: 'isNew',
			header: () => (
				<>
					<StarIcon fill="grey_1" />
				</>
			),
		},

		...originalCols,
	];

	return (
		<div
			ref={containerRef}
			css={css`
				position: relative;
			`}
		>
			<TableInfoHeaderContainer
				left={<StatsArea stats={stats} />}
				right={<SubmissionInfoArea {...submissionInfo} />}
			/>
			<Table columns={columns} data={records} withHeaders />
		</div>
	);
};

export default FileTable;
