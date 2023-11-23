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

import { Program } from '@/__generated__/graphql';
import { ColumnDef } from '@icgc-argo/uikit';
import { ArgoMembershipKey } from '../components/ProgramList';
import CancerTypes from './CancerTypes';
import Countries from './Countries';
import DonorStatus from './DonorStatus';
import TableHeader from './Header';
import ShortName from './ShortName';

const MembershipDisplayName: { [key in ArgoMembershipKey]: string } = {
	FULL: 'FULL',
	ASSOCIATE: 'ASSOCIATE',
};

export const columns: ColumnDef<Program>[] = [
	{
		header: () => <TableHeader>Short Name</TableHeader>,
		accessorKey: 'shortName',
		cell: ({
			row: {
				original: { shortName },
			},
		}) => <ShortName shortName={shortName} />,
	},
	{
		header: () => <TableHeader>Program Name</TableHeader>,
		accessorKey: 'name',
		cell: ({ row: { original } }) => <div>{original.name}</div>,
	},
	{
		header: () => <TableHeader>Cancer Types</TableHeader>,
		accessorKey: 'cancerTypes',
		cell: ({
			row: {
				original: { cancerTypes },
			},
		}) => <CancerTypes types={cancerTypes} />,
	},
	{
		header: () => <TableHeader>Countries</TableHeader>,
		accessorKey: 'countries',
		cell: ({
			row: {
				original: { countries },
			},
		}) => <Countries countries={countries} />,
	},
	{
		header: () => <TableHeader>Membership</TableHeader>,
		accessorKey: 'membershipType',
	},
	{
		header: () => <TableHeader>Donor Status</TableHeader>,
		accessorKey: 'donorPercentage',
		size: 200,
		cell: ({
			row: {
				original: { submittedDonors, commitmentDonors },
			},
		}) => <DonorStatus submittedDonors={submittedDonors} commitmentDonors={commitmentDonors} />,
	},
];
