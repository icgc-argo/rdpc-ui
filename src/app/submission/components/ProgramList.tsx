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
'use client';

import { useTheme } from '@emotion/react';
import { ColumnDef, PercentageBar, Table, Typography, css } from '@icgc-argo/uikit';
import { get } from 'lodash';
import Link from 'next/link';
import { ReactNode } from 'react';
import { TEMP_DATA } from './data.temp';

type ArgoMembershipKey = 'FULL' | 'ASSOCIATE';

type ProgramsTableData = {
	shortName: string;
	name: string | null;
	cancerTypes: Array<string>;
	countries: Array<string> | null;
	membershipType: ArgoMembershipKey | null;
	genomicDonors: number | null;
	submittedDonors: number;
	commitmentDonors: number;
	administrators: { firstName: string; lastName: string; email: string }[];
	donorPercentage: number;
};

console.log(TEMP_DATA);

// const FormattedCell: ComponentType<{ cellInfo: TableProgramInternal; children: any }> = ({
// 	children,
// 	cellInfo,
// }) => {
// 	const isRenderingOnMultipleRows = useMemo(() => {
// 		return 1;
// 		//return cellInfo.countries.length > 1 || cellInfo.cancerTypes.length > 1;
// 	}, [cellInfo]);

// 	return (
// 		<div
// 			css={css`
// 				width: 100%;
// 				align-self: ${isRenderingOnMultipleRows ? `flex-start` : `center`};
// 			`}
// 		>
// 			{children}
// 		</div>
// 	);
// };

const FormattedCell = ({ children }: any) => <div>{children}</div>;

const MembershipDisplayName: { [key in ArgoMembershipKey]: string } = {
	FULL: 'FULL',
	ASSOCIATE: 'ASSOCIATE',
};

export default function ProgramList({ children }: { children: ReactNode }) {
	const columns: ColumnDef<ProgramsTableData>[] = [
		{
			header: 'Short Name',
			accessorKey: 'shortName',
			cell: ({ row: { original } }) => {
				const shortName = original.shortName;
				return (
					<FormattedCell cellInfo={original}>
						<Link
							href={'PROGRAM_DASHBOARD_PATH'}
							as={'PROGRAM_DASHBOARD_PATH'.replace('PROGRAM_SHORT_NAME_PATH', shortName)}
						>
							<Link href="">{shortName}</Link>
						</Link>
					</FormattedCell>
				);
			},
		},
		{
			header: 'Program Name',
			accessorKey: 'name',
			cell: ({ row: { original } }) => (
				<FormattedCell cellInfo={original}>{original.name}</FormattedCell>
			),
		},
		{
			header: 'Cancer Types',
			accessorKey: 'cancerTypes',
			cell: ({ row: { original } }) => (
				<FormattedCell cellInfo={original}>
					{original.cancerTypes.map((cancerType, i) => (
						<div key={cancerType}>
							{cancerType}
							{i < original.cancerTypes.length - 1 && ','}
						</div>
					))}
				</FormattedCell>
			),
		},
		{
			header: 'Countries',
			accessorKey: 'countries',
			cell: ({ row: { original } }) => {
				const list = original.countries || [];
				return (
					<FormattedCell cellInfo={original}>
						{list.map((country, i) => (
							<div key={country}>
								{country}
								{i < list.length - 1 && ','}
							</div>
						))}
					</FormattedCell>
				);
			},
		},
		{
			header: 'Membership',
			accessorKey: 'membershipType',
			cell: ({ row: { original } }) => (
				<FormattedCell cellInfo={original}>
					{original.membershipType ? MembershipDisplayName[original.membershipType] : ''}
				</FormattedCell>
			),
		},
		{
			header: 'Administrators',
			accessorKey: 'administrators',
			cell: ({ row: { original } }) => {
				const adminLinks = get(original, 'administrators', []).map((admin, idx) => (
					<Link
						key={admin.email}
						href={`mailto: ${admin.email}`}
						css={css`
							margin-right: 0.5em;
						`}
					>
						{admin.firstName + ' ' + admin.lastName}
						{idx != original.administrators.length - 1 && ','}
					</Link>
				));

				//const cellContent = tableProps.loadingUser ? <>Loading</> : adminLinks;
				const cellContent = false ? <>Loading</> : adminLinks;

				return <FormattedCell cellInfo={original}>{cellContent}</FormattedCell>;
			},
		},
		{
			header: 'Donor Status',
			accessorKey: 'donorPercentage',
			size: 200,
			cell: ({ row: { original } }) => (
				<FormattedCell cellInfo={original}>
					<PercentageBar
						nom={original.submittedDonors}
						denom={original.commitmentDonors}
						css={css`
							display: flex;
							justify-content: flex-start;
						`}
					/>
				</FormattedCell>
			),
		},
	];

	const theme = useTheme();

	return (
		<div
			css={css`
				padding: 16px 15px 6px;
			`}
		>
			<Typography
				variant="label"
				css={css`
					color: ${theme.colors.grey};
					min-height: 32px;
					display: flex;
					align-items: center;
					margin-bottom: 8px;
				`}
			>
				{TEMP_DATA.length.toLocaleString()} results
			</Typography>
			<Table
				//parentRef={createRef()}
				data={TEMP_DATA}
				columns={columns}
				withSideBorders
				withRowBorder
				withStripes
				withHeaders
				withPagination
				showPageSizeOptions
				//loading={tableProps.loading}
				pageSize={TEMP_DATA.length}
				//LoadingComponent={tableProps.LoadingComponent}
			/>
		</div>
	);
}