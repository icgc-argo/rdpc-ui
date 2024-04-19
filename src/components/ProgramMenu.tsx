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

import { SideMenuProgramStatusQuery, SubmissionState } from '@/__generated__/clinical/graphql';
import Loader from '@/app/components/Loader';
import SIDEMENU_PROGRAM_STATUS from '@/app/gql/clinical/SIDEMENU_PROGRAM_STATUS';
import SIDEMENU_PROGRAMS from '@/app/gql/gateway/SIDEMENU_PROGRAMS';
import {
	useAppConfigContext,
	useAuthContext,
	useClinicalQuery,
	useGatewayQuery,
	useSubmissionSystemStatus,
	useUserRole,
} from '@/app/hooks';
import {
	PROGRAM_CLINICAL_DATA_PATH,
	PROGRAM_CLINICAL_SUBMISSION_PATH,
	PROGRAM_DASHBOARD_PATH,
	PROGRAM_MANAGE_PATH,
	PROGRAM_SAMPLE_REGISTRATION_PATH,
} from '@/global/constants';
import { getProgramPath, notNull } from '@/global/utils';
import { css } from '@/lib/emotion';
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
	const { DATA_CENTER } = useAppConfigContext();

	// params can be arrays from dynamic routing
	const activeProgramParam = typeof params.shortName === 'string' ? params.shortName : '';

	const {
		data: programsData,
		loading,
		error,
	} = useGatewayQuery(SIDEMENU_PROGRAMS, {
		variables: { dataCenter: DATA_CENTER },
	});

	const programs = programsData?.programs
		?.filter(notNull)
		.filter((program) => program.shortName.search(new RegExp(shortNameSearchQuery, 'i')) > -1);

	const sortedProgramList = orderBy(programs, 'shortName');

	const [activeProgram, setActiveProgram] = useState<string | undefined>(activeProgramParam);

	if (loading) {
		return <Loader />;
	} else if (error) {
		notFound();
	} else {
		return (
			<>
				<Link
					href="/submission/program"
					css={css`
						text-decoration: none !important;
					`}
				>
					<MenuItem
						level={2}
						content="All Programs"
						onClick={() => {
							setActiveProgram(undefined);
						}}
						selected={pathname === '/submission/program'}
					/>
				</Link>

				{sortedProgramList.map((program) => {
					const shortName = program?.shortName || '';
					const isActiveProgram = activeProgram === shortName;

					return (
						<MenuItem
							level={2}
							key={shortName}
							content={shortName}
							onClick={() => {
								if (isActiveProgram) {
									setActiveProgram(undefined);
								} else {
									setActiveProgram(shortName);
								}
							}}
							selected={isActiveProgram}
						>
							<MenuItem level={3}>{shortName}</MenuItem>
							<MenuContent programName={shortName} />
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

	const clinicalSubmissionState = data?.clinicalSubmissions?.state;

	return {
		clinicalDataHasErrors,
		clinicalRegistration,
		clinicalRegistrationHasError,
		clinicalSubmissionHasSchemaErrors,
		clinicalRegistrationInProgress,
		clinicalSubmissionState,
	};
};

const renderDataSubmissionLinks = (
	registrationPath: string,
	submissionPath: string,
	statusIcon: ReactNode | null,
	isSubmissionSystemDisabled: boolean,
	pathnameLastSegment?: string,
	programStatusData?: ReturnType<typeof parseProgramStatusGQLResp>,
) => (
	<>
		<Link href={registrationPath}>
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
		<Link href={submissionPath}>
			<MenuItem
				level={3}
				content={
					<StatusMenuItem>
						Submit Clinical Data{' '}
						{programStatusData &&
							renderSubmissionStatusIcon(
								programStatusData.clinicalSubmissionState || null,
								programStatusData.clinicalSubmissionHasSchemaErrors,
								isSubmissionSystemDisabled,
							)}
					</StatusMenuItem>
				}
				selected={pathnameLastSegment === 'clinical-submission'}
			/>
		</Link>
	</>
);

const renderSubmissionStatusIcon = (
	status: SubmissionState | null,
	hasSubmissionErrors: boolean,
	isSubmissionSystemDisabled: boolean,
) => {
	if (isSubmissionSystemDisabled) {
		return <Icon name="lock" fill="accent3_dark" width="15px" />;
	}

	switch (status) {
		case SubmissionState.Open:
			return hasSubmissionErrors ? (
				<Icon name="exclamation" fill="error" width="15px" />
			) : (
				<Icon name="exclamation" fill="error" width="15px" />
			);
		case SubmissionState.Valid:
			return <Icon name="ellipses" fill="warning" width="15px" />;
		case SubmissionState.Invalid:
		case SubmissionState.InvalidByMigration:
			return <Icon name="exclamation" fill="error" width="15px" />;
		case SubmissionState.PendingApproval:
			return <Icon name="lock" fill="accent3_dark" width="15px" />;
		default:
			return hasSubmissionErrors ? <Icon name="exclamation" fill="error" width="15px" /> : null;
	}
};

const MenuContent = ({ programName }: { programName: string }) => {
	const { egoJwt } = useAuthContext();
	const pathname = usePathname();
	const pathnameLastSegment = pathname.split('/').at(-1);

	const { isDisabled: isSubmissionSystemDisabled } = useSubmissionSystemStatus();

	const userRoles = useUserRole(egoJwt, programName);

	const { data: gqlData } = useClinicalQuery(SIDEMENU_PROGRAM_STATUS, {
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

	const registrationStatusIcon = isSubmissionSystemDisabled ? (
		<Icon name="lock" fill="accent3_dark" width="15px" />
	) : programStatusData?.clinicalRegistrationHasError ? (
		<Icon name="exclamation" fill="error" width="15px" />
	) : programStatusData?.clinicalRegistrationInProgress ? (
		<Icon name="ellipses" fill="warning" width="15px" />
	) : null;

	return (
		<>
			{/** Dashboard */}
			<Link href={getProgramPath(PROGRAM_DASHBOARD_PATH, programName)}>
				<MenuItem level={3} content="Dashboard" selected={pathnameLastSegment === 'dashboard'} />
			</Link>

			{/** Register Samples */}
			{userCanSubmitData &&
				renderDataSubmissionLinks(
					getProgramPath(PROGRAM_SAMPLE_REGISTRATION_PATH, programName),
					getProgramPath(PROGRAM_CLINICAL_SUBMISSION_PATH, programName),
					registrationStatusIcon,
					isSubmissionSystemDisabled,
					pathnameLastSegment,
					programStatusData,
				)}

			{/** Submitted Data */}
			{userCanViewData && (
				<Link href={getProgramPath(PROGRAM_CLINICAL_DATA_PATH, programName)}>
					<MenuItem
						level={3}
						content={
							<StatusMenuItem>
								Submitted Data{' '}
								{/* {clinicalDataHasErrors && <Icon name="exclamation" fill="error" width="15px" />} */}
							</StatusMenuItem>
						}
						selected={pathnameLastSegment === 'clinical-data'}
					/>
				</Link>
			)}

			{/** Manage Program */}
			{userCanManageProgram && (
				<Link href={getProgramPath(PROGRAM_MANAGE_PATH, programName)}>
					<MenuItem
						level={3}
						content="Manage Program"
						selected={pathnameLastSegment === 'manage'}
					/>
				</Link>
			)}
		</>
	);
};

export default ProgramMenu;
