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

import { BreadcrumbTitle, PageHeader } from '@/app/components/PageHeader/PageHeader';
import PROGRAMS_LIST_QUERY from '@/app/gql/PROGRAMS_LIST_QUERY';
import { useAppConfigContext } from '@/app/hooks/AppProvider';
import { useGatewayQuery } from '@/app/hooks/useApolloQuery';
import { CREATE_PROGRAM_PAGE_PATH } from '@/global/constants';
import { notNull } from '@/global/utils';
import { Button, Loader } from '@icgc-argo/uikit';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProgramList from '../components/ProgramList';

export default function Submission() {
	const { DATA_CENTER } = useAppConfigContext();
	const { data, loading, error } = useGatewayQuery(PROGRAMS_LIST_QUERY, {
		variables: { dataCenter: DATA_CENTER },
	});

	const programs = data?.programs?.filter(notNull) || [];

	if (loading) return <Loader />;
	if (error) notFound();

	const canCreate = true;
	return (
		<div>
			<PageHeader
				leftSlot={<BreadcrumbTitle breadcrumbs={['All Programs']} />}
				rightSlot={
					canCreate && (
						<Link href={CREATE_PROGRAM_PAGE_PATH} legacyBehavior>
							<Button>Create a program</Button>
						</Link>
					)
				}
			/>
			<ProgramList programs={programs} />
		</div>
	);
}
