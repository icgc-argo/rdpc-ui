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
import { useAppConfigContext } from '@/app/hooks/AppProvider';
import { useAuthContext } from '@/app/hooks/AuthProvider';
import { useSubmissionSystemStatus } from '@/app/hooks/useSubmissionSystemStatus';
import useUserRole, { UserRoleList } from '@/app/hooks/useUserRole';
import {
	PROGRAM_CLINICAL_DATA_PATH,
	PROGRAM_DASHBOARD_PATH,
	PROGRAM_MANAGE_PATH,
	PROGRAM_SHORT_NAME_PATH,
} from '@/global/constants';
import { notNull } from '@/global/utils';
import { css } from '@/lib/emotion';
import { useQuery } from '@apollo/client';
import { Icon, MenuItem } from '@icgc-argo/uikit';
import orderBy from 'lodash/orderBy';
import Link from 'next/link';
import { notFound, useParams, usePathname } from 'next/navigation';
import { FC, ReactNode, useState } from 'react';
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

/**
 * Uses query param: shortName representing the currently selected program's shortName.
 * Uses the URL path to identify which page from the menu is selected.
 */
const ProgramMenu = ({ shortNameSearchQuery }: { shortNameSearchQuery: string }) => {
	const params = useParams();
	const pathname = usePathname();
	const { egoJwt } = useAuthContext();
	const { DATA_CENTER } = useAppConfigContext();

	// params can be arrays from dynamic routing
	const activeProgramName = typeof params.shortName === 'string' ? params.shortName : '';

	const {
		data: programsData,
		loading,
		error,
	} = useQuery(SIDEMENU_PROGRAMS, { variables: { dataCenter: DATA_CENTER } });
	const programs = programsData?.programs || [];

	const filteredPrograms = !shortNameSearchQuery.length
		? programs.filter(notNull)
		: programs
				.filter(notNull)
				.filter((program) => program.shortName.search(new RegExp(shortNameSearchQuery, 'i')) > -1);
	const sortedProgramList = orderBy(filteredPrograms, 'shortName');

	const [activeProgram, setActiveProgram] = useState(activeProgramName);

	const userRoles = useUserRole(egoJwt, activeProgram);

	if (loading) {
		return <Loader />;
	} else if (error) {
		notFound();
	} else {
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
						onClick={() => {
							setActiveProgram('');
						}}
						selected={pathname === '/submission'}
					/>
				</Link>

				{sortedProgramList.map((program) => {
					const shortName = program?.shortName || '';

					return (
						<MenuItem
							level={2}
							key={shortName}
							content={shortName}
							onClick={() => {
								activeProgram === shortName ? setActiveProgram('') : setActiveProgram(shortName);
							}}
							selected={activeProgram === shortName}
						>
							<MenuItem level={3}>{shortName}</MenuItem>
							<MenuContent programName={shortName} userRoles={userRoles} />
						</MenuItem>
					);
				})}
			</>
		);
	}
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

const MenuContent = ({
	programName,
	userRoles,
}: {
	programName: string;
	userRoles: UserRoleList;
}) => {
	const pathname = usePathname();
	const pathnameLastSegment = pathname.split('/').at(-1);

	const { isDisabled: isSubmissionSystemDisabled } = useSubmissionSystemStatus();

	const { data: gqlData } = useQuery(SIDEMENU_PROGRAM_STATUS, {
		variables: {
			activeProgramName: programName,
			filters: defaultClinicalEntityFilters,
		},
	});

	const { isRDPCAdmin, isDCCAdmin, isProgramAdmin, isDataSubmitter, isCollaborator } = userRoles;

	const userCanSubmitData = isDataSubmitter || isRDPCAdmin || isDCCAdmin || isProgramAdmin;
	const userCanViewData =
		isCollaborator || isDataSubmitter || isRDPCAdmin || isDCCAdmin || isProgramAdmin;
	const userCanManageProgram = isDataSubmitter || isRDPCAdmin || isDCCAdmin || isProgramAdmin;

	const programStatusData = parseProgramStatusGQLResp(gqlData);

	const statusIcon = isSubmissionSystemDisabled ? (
		<Icon name="lock" fill="accent3_dark" width="15px" />
	) : programStatusData?.clinicalRegistrationHasError ? (
		<Icon name="exclamation" fill="error" width="15px" />
	) : programStatusData?.clinicalRegistrationInProgress ? (
		<Icon name="ellipses" fill="warning" width="15px" />
	) : null;

	return (
		<>
			{/** Dashboard */}
			<Link
				as={PROGRAM_DASHBOARD_PATH.replace(PROGRAM_SHORT_NAME_PATH, programName)}
				href={PROGRAM_DASHBOARD_PATH}
			>
				<MenuItem level={3} content="Dashboard" selected={PROGRAM_DASHBOARD_PATH === pathname} />
			</Link>

			{/** Register Samples */}
			{userCanSubmitData && (
				<>
					<Link href={`/submission/program/${programName}/registration`}>
						<MenuItem
							level={3}
							content={
								<StatusMenuItem>
									Register Samples
									{statusIcon}
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
			)}

			{/** Submitted Data */}
			{userCanViewData && (
				<Link
					as={`${PROGRAM_CLINICAL_DATA_PATH.replace(
						PROGRAM_SHORT_NAME_PATH,
						programName,
					)}?tab=donor`}
					href={PROGRAM_CLINICAL_DATA_PATH}
				>
					<MenuItem
						level={3}
						content={
							<StatusMenuItem>
								Submitted Data{' '}
								{/* {clinicalDataHasErrors && <Icon name="exclamation" fill="error" width="15px" />} */}
							</StatusMenuItem>
						}
						selected={PROGRAM_CLINICAL_DATA_PATH === pathname}
					/>
				</Link>
			)}

			{/** Manage Program */}
			{userCanManageProgram && (
				<Link
					as={PROGRAM_MANAGE_PATH.replace(PROGRAM_SHORT_NAME_PATH, programName)}
					href={PROGRAM_MANAGE_PATH}
				>
					<MenuItem
						level={3}
						content="Manage Program"
						selected={PROGRAM_MANAGE_PATH === pathname}
					/>
				</Link>
			)}
		</>
	);
};

export default ProgramMenu;
