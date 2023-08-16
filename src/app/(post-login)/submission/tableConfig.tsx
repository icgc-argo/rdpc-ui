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

import { css } from '@/lib/emotion';
import { ColumnDef, PercentageBar } from '@icgc-argo/uikit';
import { get } from 'lodash';
import Link from 'next/link';
import { ArgoMembershipKey, ProgramData } from './components/ProgramList';

const MembershipDisplayName: { [key in ArgoMembershipKey]: string } = {
	FULL: 'FULL',
	ASSOCIATE: 'ASSOCIATE',
};

export const columns: ColumnDef<ProgramData>[] = [
	{
		header: 'Short Name',
		accessorKey: 'shortName',
		cell: ({ row: { original } }) => {
			const shortName = original.shortName;
			return (
				<div>
					<Link href={`submission/${shortName}`}>{shortName}</Link>
				</div>
			);
		},
	},
	{
		header: 'Program Name',
		accessorKey: 'name',
		cell: ({ row: { original } }) => <div>{original.name}</div>,
	},
	{
		header: 'Cancer Types',
		accessorKey: 'cancerTypes',
		cell: ({ row: { original } }) => (
			<div>
				{original.cancerTypes.map((cancerType: any, i: number) => (
					<div key={cancerType}>
						{cancerType}
						{i < original.cancerTypes.length - 1 && ','}
					</div>
				))}
			</div>
		),
	},
	{
		header: 'Countries',
		accessorKey: 'countries',
		cell: ({ row: { original } }) => {
			const list = original.countries || [];
			return (
				<div>
					{list.map((country: any, i: number) => (
						<div key={country}>
							{country}
							{i < list.length - 1 && ','}
						</div>
					))}
				</div>
			);
		},
	},
	{
		header: 'Membership',
		accessorKey: 'membershipType',
		cell: ({ row: { original } }) => {
			return (
				<div>{original.membershipType ? 'MembershipDisplayName[original.membershipType]' : ''}</div>
			);
		},
	},
	{
		header: 'Administrators',
		accessorKey: 'administrators',
		cell: ({ row: { original } }) => {
			const adminLinks = get(original, 'administrators', []).map((admin: any, idx: number) => (
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

			return <div>{adminLinks}</div>;
		},
	},
	{
		header: 'Donor Status',
		accessorKey: 'donorPercentage',
		size: 200,
		cell: ({ row: { original } }) => (
			<div>
				<PercentageBar
					nom={original.submittedDonors}
					denom={original.commitmentDonors}
					css={css`
						display: flex;
						justify-content: flex-start;
					`}
				/>
			</div>
		),
	},
];
