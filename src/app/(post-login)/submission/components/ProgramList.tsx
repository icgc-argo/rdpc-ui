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

import { Program } from '@/__generated__/gateway/graphql';
import { css } from '@/lib/emotion';
import { Table, Typography } from '@icgc-argo/uikit';
import orderBy from 'lodash/orderBy';
import { columns } from '../program-table/config';

export type ArgoMembershipKey = 'FULL' | 'ASSOCIATE';

export default function ProgramList({ programs }: { programs: Program[] }) {
	const sortedProgramList = orderBy(programs, 'name');
	const programsArraySize = programs.length;

	return (
		<div
			css={css`
				padding: 16px 15px 6px;
			`}
		>
			<Typography
				variant="label"
				color="grey"
				component="div"
				css={css`
					min-height: 32px;
					display: flex;
					align-items: center;
					margin-bottom: 8px;
				`}
			>
				{programsArraySize.toLocaleString()} results
			</Typography>
			<Table
				data={sortedProgramList}
				columns={columns}
				pageCount={20}
				withSideBorders
				withRowBorder
				withStripes
				withHeaders
				withPagination
				showPageSizeOptions
				loading={false}
			/>
		</div>
	);
}
