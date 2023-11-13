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

import { SideMenuProgramStatusQuery } from '@/__generated__/graphql';
import Loader from '@/app/components/Loader';
import SIDEMENU_PROGRAMS from '@/app/gql/SIDEMENU_PROGRAMS';
import SIDEMENU_PROGRAM_STATUS from '@/app/gql/SIDEMENU_PROGRAM_STATUS';
import { useSubmissionSystemStatus } from '@/app/hooks/useSubmissionSystemStatus';
import { css } from '@/lib/emotion';
import { useQuery } from '@apollo/client';
import { Icon, MenuItem } from '@icgc-argo/uikit';
import Link from 'next/link';
import { notFound, useParams, usePathname } from 'next/navigation';
import { FC, MouseEventHandler, ReactNode, useState } from 'react';
import { defaultClinicalEntityFilters } from '../common';

const StatusMenuItem: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<div
			css={css`
				display: flex;
				justify-content: space-between;
				width: 100%;
				align-items: center;
				padding-right: 15px;
			`}
		>
			{children}
		</div>
	);
};

const ProgramMenu = ({ searchQuery }: { searchQuery: string }) => {
	const params = useParams();
	const pathname = usePathname();
	const activeProgramName = typeof params.shortName !== 'string' ? '' : params.shortName;

	const { data: programsData, loading, error } = useQuery(SIDEMENU_PROGRAMS);
	const programs = programsData?.programs || [];

	const [activeProgramIndex, setActiveProgramIndex] = useState(-1);

	const filteredPrograms = !searchQuery.length
		? programs
		: programs.filter(
				(program) => program && program.shortName.search(new RegExp(searchQuery, 'i')) > -1,
		  );

	const setActiveProgram =
		(index: number): MouseEventHandler =>
		() =>
			setActiveProgramIndex(index);

	if (loading) return <Loader />;
	if (error) notFound();

	return (
		<>
			<Link
				href="/submission"
				css={css`
					text-decoration: none !important;
				`}
			>
				<MenuItem
					level={2}
					content="All Programs"
					onClick={setActiveProgram(-1)}
					selected={pathname === '/submission'}
				/>
			</Link>

			{filteredPrograms.map((program, programIndex) => {
				const shortName = program?.shortName || '';
				return (
					<MenuItem
						level={2}
						key={shortName}
						content={shortName}
						onClick={setActiveProgram(programIndex)}
						selected={programIndex === activeProgramIndex || activeProgramName === shortName}
					>
						<MenuItem level={3}>{shortName}</MenuItem>
						<MenuContent programName={shortName} />
					</MenuItem>
				);
			})}
		</>
	);
};

const parseProgramStatusGQLResp = (data: SideMenuProgramStatusQuery | undefined) => {
	if (!data) return null;

	const clinicalErrors = data.clinicalData.clinicalErrors;
	const clinicalDataHasErrors = (clinicalErrors && clinicalErrors.length > 0) || false;

	const clinicalRegistration = data && data.clinicalRegistration;

	const clinicalRegistrationHasError =
		clinicalRegistration &&
		(!!clinicalRegistration.errors.length || !!clinicalRegistration.fileErrors?.length);

	const clinicalRegistrationInProgress = clinicalRegistration && !!clinicalRegistration.fileName;

	const clinicalSubmissionHasSchemaErrors = data
		? data.clinicalSubmissions.clinicalEntities.some(
				(entity) => entity && !!entity.schemaErrors.length,
		  )
		: false;

	return {
		clinicalDataHasErrors,
		clinicalRegistration,
		clinicalRegistrationHasError,
		clinicalSubmissionHasSchemaErrors,
		clinicalRegistrationInProgress,
	};
};

const MenuContent = ({ programName }: { programName: string }) => {
	const pathname = usePathname();
	const pathnameLastSegment = pathname.split('/')[-1];

	const { isDisabled: isSubmissionSystemDisabled } = useSubmissionSystemStatus();

	const { data: gqlData } = useQuery(SIDEMENU_PROGRAM_STATUS, {
		variables: {
			activeProgramName: programName,
			filters: defaultClinicalEntityFilters,
		},
	});

	const programStatusData = parseProgramStatusGQLResp(gqlData);

	return (
		<>
			{/** Register Samples */}
			<Link href={`/submission/program/${programName}/registration`}>
				<MenuItem
					level={3}
					content={
						<StatusMenuItem>
							Register Samples
							{isSubmissionSystemDisabled ? (
								<Icon name="lock" fill="accent3_dark" width="15px" />
							) : programStatusData?.clinicalRegistrationHasError ? (
								<Icon name="exclamation" fill="error" width="15px" />
							) : programStatusData?.clinicalRegistrationInProgress ? (
								<Icon name="ellipses" fill="warning" width="15px" />
							) : null}
						</StatusMenuItem>
					}
					selected={pathnameLastSegment === 'registration'}
				/>
			</Link>

			{/** Submit clinical data */}
			<Link href={`/submission/program/${programName}/clinical-submission`}>
				<MenuItem
					level={3}
					content={<StatusMenuItem>Submit Clinical Data </StatusMenuItem>}
					selected={pathnameLastSegment === 'clinical-submission'}
				/>
			</Link>
		</>
	);
};

export default ProgramMenu;
