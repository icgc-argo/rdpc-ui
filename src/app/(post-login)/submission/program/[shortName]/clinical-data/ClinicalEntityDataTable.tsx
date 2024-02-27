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

import { ClinicalSearchResults } from '@/__generated__/clinical/graphql';
import ErrorNotification from '@/app/components/ErrorNotification';
import { TableInfoHeaderContainer } from '@/app/components/Table/common';
import CLINICAL_ENTITY_DATA_QUERY from '@/app/gql/clinical/CLINICAL_ENTITY_DATA_QUERY';
import CLINICAL_SCHEMA_VERSION from '@/app/gql/clinical/CLINICAL_SCHEMA_VERSION';
import { useAppConfigContext } from '@/app/hooks/AppProvider';
import { useClinicalQuery } from '@/app/hooks/useApolloQuery';
import { PROGRAM_CLINICAL_SUBMISSION_PATH, PROGRAM_SHORT_NAME_PATH } from '@/global/constants';
import {
	ContentPlaceholder,
	DnaLoader,
	Icon,
	Link,
	NOTIFICATION_VARIANTS,
	Table,
	Typography,
	css,
	useTheme,
} from '@icgc-argo/uikit';
import memoize from 'lodash/memoize';
import { createRef, useEffect, useState } from 'react';
import urljoin from 'url-join';
import {
	Cell,
	ClinicalCoreCompletionHeader,
	TopLevelHeader,
	styleThickBorder,
} from './ClinicalDataTableComp';
import {
	ClinicalEntitySearchResultResponse,
	CompletionStates,
	aliasSortNames,
	aliasedEntityFields,
	aliasedEntityNames,
	clinicalEntityDisplayNames,
	clinicalEntityFields,
	defaultClinicalEntityFilters,
	emptyClinicalDataResponse,
	emptySearchResponse,
} from './common';
import { formatTableErrors, usePageSettings } from './tableDataRefactor';

export type DonorEntry = {
	row: string;
	isNew: boolean;
	[k: string]: string | number | boolean;
};

const errorColumns = [
	{
		accessorKey: 'entries',
		Header: '# Affected Records',
		id: 'entries',
		maxWidth: 135,
	},
	{
		accessorKey: 'fieldName',
		Header: `Field with Error`,
		id: 'fieldName',
		maxWidth: 215,
	},
	{
		accessorKey: 'errorMessage',
		Header: `Error Description`,
		id: 'errorMessage',
	},
];

const NoDataCell = () => (
	<div
		css={css`
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 80px 0;
		`}
	>
		<ContentPlaceholder title="No Data Found.">
			<img alt="No Data" src="/assets/no-data.svg" />
		</ContentPlaceholder>
	</div>
);

const completionKeys = Object.values(aliasSortNames);
const completionColumnNames = Object.keys(aliasSortNames);
const emptyCompletion = {
	DO: 0,
	PD: 0,
	FO: 0,
	NS: 0,
	TR: 0,
	TS: 0,
};

const noDataCompletionStats = [
	{
		donor_id: 0,
		...emptyCompletion,
	},
];

const completionColumnHeaders = {
	donor: 'DO',
	primaryDiagnosis: 'PD',
	normalSpecimens: 'NS',
	tumourSpecimens: 'TS',
	treatments: 'TR',
	followUps: 'FO',
};

const coreCompletionFields = Object.keys(completionColumnHeaders);

const getColumnWidth = memoize<
	(keyString: string, showCompletionStats: boolean, noData: boolean) => number
>((keyString, showCompletionStats, noData) => {
	const minWidth = keyString === 'donor_id' ? 70 : showCompletionStats ? 40 : 95;
	const maxWidth = noData && showCompletionStats ? 45 : 200;
	const spacePerChar = 8;
	const margin = 10;
	const targetWidth = keyString.length * spacePerChar + margin;
	return Math.max(Math.min(maxWidth, targetWidth), minWidth);
});

const defaultErrorPageSettings = {
	page: 0,
	pageSize: 5,
	sorted: [{ id: 'donorId', desc: true }],
};

const validateEntityQueryName = (entityQuery) => {
	const entities = typeof entityQuery === 'string' ? [entityQuery] : entityQuery;
	return entities.map((entityName) => clinicalEntityFields.find((entity) => entity === entityName));
};

// Function: GQL Query
type GetEntityDataProps = {
	program: string;
	entityType: string | string[];
	page: number;
	pageSize: number;
	sort: string;
	completionState: CompletionStates;
	donorIds: number[];
	submitterDonorIds: string[];
};
export const useGetEntityData = ({
	program,
	entityType,
	page,
	pageSize,
	sort,
	completionState,
	donorIds,
	submitterDonorIds,
}: GetEntityDataProps) => {
	console.log('get data', {
		program,
		entityType,
		page,
		pageSize,
		sort,
		completionState,
		donorIds,
		submitterDonorIds,
	});
	const entityTypes = validateEntityQueryName(entityType);

	return useClinicalQuery(CLINICAL_ENTITY_DATA_QUERY, {
		errorPolicy: 'all',
		fetchPolicy: 'cache-and-network',
		variables: {
			programShortName: program,
			filters: {
				...defaultClinicalEntityFilters,
				sort,
				page,
				pageSize,
				completionState,
				donorIds,
				submitterDonorIds,
				entityTypes,
			},
		},
	});
};

// Component: Subtitle
const Subtitle = ({ program = '' }) => {
	const { DOCS_URL_ROOT } = useAppConfigContext();
	const DOCS_DICTIONARY_PAGE = urljoin(DOCS_URL_ROOT, '/dictionary/');
	const latestDictionaryResponse = useClinicalQuery(CLINICAL_SCHEMA_VERSION);

	return (
		<div
			css={css`
				margin-bottom: 12px;
			`}
		>
			<Link target="_blank" href={DOCS_DICTIONARY_PAGE}>
				{!latestDictionaryResponse.loading &&
					`Version ${latestDictionaryResponse.data.clinicalSubmissionSchemaVersion}`}
			</Link>{' '}
			of the data dictionary was released and has made some donors invalid. Please download the
			error report to view the affected donors, then submit a corrected TSV file in the{' '}
			<Link href={PROGRAM_CLINICAL_SUBMISSION_PATH.replace(PROGRAM_SHORT_NAME_PATH, program)}>
				Submit Clinical Data{' '}
			</Link>
			workspace.
		</div>
	);
};

type ClinicalEntityDataTableProps = {
	entityType: string;
	program: string;
	completionState: CompletionStates;
	currentDonors: number[];
	donorSearchResults: ClinicalEntitySearchResultResponse;
	useDefaultQuery: boolean;
	noData: boolean;
};
const ClinicalEntityDataTable = ({
	entityType,
	program,
	completionState = CompletionStates['all'],
	currentDonors,
	donorSearchResults = emptySearchResponse,
	useDefaultQuery,
	noData,
}: ClinicalEntityDataTableProps) => {
	const theme = useTheme();
	const containerRef = createRef<HTMLDivElement>();

	// Init + Page Settings
	let totalDocs = 0;
	let showCompletionStats = false;
	let records = [];
	let columns = [];

	const { pageSettings, defaultPageSettings, setPageSettings } = usePageSettings({
		useDefaultQuery,
		entityType,
	});
	const { page, pageSize, sorted } = pageSettings;

	const [errorPageSettings, setErrorPageSettings] = useState(defaultErrorPageSettings);
	const { page: errorPage, pageSize: errorPageSize, sorted: errorSorted } = errorPageSettings;

	const { desc, id } = sorted[0];
	const sortKey = aliasSortNames[id] || id;
	const sort = `${desc ? '-' : ''}${sortKey}`;

	const {
		clinicalSearchResults: { searchResults, totalResults },
	} = donorSearchResults || emptySearchResponse;

	const nextSearchPage = (page + 1) * pageSize;

	const donorIds = useDefaultQuery
		? []
		: currentDonors.length
		? currentDonors
		: searchResults.map(({ donorId }: ClinicalSearchResults) => donorId);

	const submitterDonorIds =
		useDefaultQuery || currentDonors.length
			? []
			: searchResults
					.map(({ submitterDonorId }: ClinicalSearchResults) => submitterDonorId)
					.filter((id) => !!id)
					.slice(page * pageSize, nextSearchPage < totalResults ? nextSearchPage : totalResults);

	const updatePageSettings = (key, value) => {
		const newPageSettings = { ...pageSettings, [key]: value };

		if (key === 'pageSize' && value !== pageSettings.pageSize) {
			// Prevents bug querying nonexistent data
			newPageSettings.page = 0;
		}
		setPageSettings(newPageSettings);
		return newPageSettings;
	};

	useEffect(() => {
		setPageSettings(defaultPageSettings);
		setErrorPageSettings(defaultErrorPageSettings);
	}, [entityType, useDefaultQuery]);

	//

	const { data: clinicalEntityData, loading } = useGetEntityData({
		program,
		entityType,
		page,
		pageSize,
		sort,
		completionState,
		donorIds,
		submitterDonorIds,
	});

	// This is the core of the logic here
	// this data response => UI
	console.log('data', clinicalEntityData);

	const { clinicalData } =
		clinicalEntityData == undefined || loading ? emptyClinicalDataResponse : clinicalEntityData;

	const noTableData = noData || clinicalData.clinicalEntities.length === 0;

	//const aliasedEntityName = aliasedEntityNames[entityType];
	const aliasedEntityName = aliasedEntityNames.primaryDiagnoses;
	const x_clinicalErrors = [
		{
			donorId: 262500,
			submitterDonorId: 'Pat-1',
			errors: [
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'lymph_nodes_examined_method',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'lymph_nodes_examined_method' field must be submitted if the 'lymph_nodes_examined_status' field is 'Yes'",
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'lymph_nodes_examined_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'lymph_nodes_examined_method' field must be submitted if the 'lymph_nodes_examined_status' field is 'Yes'",
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'lymph_nodes_examined_method',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'lymph_nodes_examined_method' field must be submitted if the 'lymph_nodes_examined_status' field is 'Yes'",
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'lymph_nodes_examined_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'lymph_nodes_examined_method' field must be submitted if the 'lymph_nodes_examined_status' field is 'Yes'",
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'lymph_nodes_examined_method',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'lymph_nodes_examined_method' field must be submitted if the 'lymph_nodes_examined_status' field is 'Yes'",
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'lymph_nodes_examined_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'lymph_nodes_examined_method' field must be submitted if the 'lymph_nodes_examined_status' field is 'Yes'",
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'lymph_nodes_examined_method',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'lymph_nodes_examined_method' field must be submitted if the 'lymph_nodes_examined_status' field is 'Yes'",
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'lymph_nodes_examined_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'lymph_nodes_examined_method' field must be submitted if the 'lymph_nodes_examined_status' field is 'Yes'",
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
			],
			__typename: 'ClinicalErrors',
		},
		{
			donorId: 262500,
			submitterDonorId: 'Pat-1',
			errors: [
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_ENUM_VALUE',
					fieldName: 'response_to_treatment',
					index: 5,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'The value is not permissible for this field.',
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 5,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'radiation therapy'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_ENUM_VALUE',
					fieldName: 'response_to_treatment',
					index: 5,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'The value is not permissible for this field.',
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 5,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'radiation therapy'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_ENUM_VALUE',
					fieldName: 'response_to_treatment',
					index: 5,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'The value is not permissible for this field.',
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 5,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'radiation therapy'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_ENUM_VALUE',
					fieldName: 'response_to_treatment',
					index: 5,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'The value is not permissible for this field.',
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 5,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'radiation therapy'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_ENUM_VALUE',
					fieldName: 'response_to_treatment',
					index: 5,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'The value is not permissible for this field.',
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 5,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'radiation therapy'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'surgery'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_ENUM_VALUE',
					fieldName: 'response_to_treatment',
					index: 5,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'The value is not permissible for this field.',
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment_criteria_method',
					index: 5,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						"The 'response_to_treatment_criteria_method' field must be submitted when the 'treatment_type' field is 'radiation therapy'",
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
			],
			__typename: 'ClinicalErrors',
		},
		{
			donorId: 262500,
			submitterDonorId: 'Pat-1',
			errors: [
				{
					errorType: 'INVALID_BY_REGEX',
					fieldName: 'anatomic_site_progression_or_recurrence',
					index: 0,
					info: {
						value: ['Unknown'],
						__typename: 'ClinicalErrorInfo',
					},
					message:
						'The value is not a permissible for this field, it must meet the regular expression: "^[C][0-9]{2}(.[0-9]{1})?$". Examples: C50.1|C18',
					entityName: 'follow_up',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'recurrence_stage_group',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						'The recurrence_stage_group must be submitted if the field recurrence_tumour_staging_system is submitted.',
					entityName: 'follow_up',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_REGEX',
					fieldName: 'anatomic_site_progression_or_recurrence',
					index: 1,
					info: {
						value: ['Unknown'],
						__typename: 'ClinicalErrorInfo',
					},
					message:
						'The value is not a permissible for this field, it must meet the regular expression: "^[C][0-9]{2}(.[0-9]{1})?$". Examples: C50.1|C18',
					entityName: 'follow_up',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'recurrence_stage_group',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						'The recurrence_stage_group must be submitted if the field recurrence_tumour_staging_system is submitted.',
					entityName: 'follow_up',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_REGEX',
					fieldName: 'anatomic_site_progression_or_recurrence',
					index: 0,
					info: {
						value: ['Unknown'],
						__typename: 'ClinicalErrorInfo',
					},
					message:
						'The value is not a permissible for this field, it must meet the regular expression: "^[C][0-9]{2}(.[0-9]{1})?$". Examples: C50.1|C18',
					entityName: 'follow_up',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'recurrence_stage_group',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						'The recurrence_stage_group must be submitted if the field recurrence_tumour_staging_system is submitted.',
					entityName: 'follow_up',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_REGEX',
					fieldName: 'anatomic_site_progression_or_recurrence',
					index: 1,
					info: {
						value: ['Unknown'],
						__typename: 'ClinicalErrorInfo',
					},
					message:
						'The value is not a permissible for this field, it must meet the regular expression: "^[C][0-9]{2}(.[0-9]{1})?$". Examples: C50.1|C18',
					entityName: 'follow_up',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'recurrence_stage_group',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						'The recurrence_stage_group must be submitted if the field recurrence_tumour_staging_system is submitted.',
					entityName: 'follow_up',
					__typename: 'ClinicalErrorRecord',
				},
			],
			__typename: 'ClinicalErrors',
		},
		{
			donorId: 262500,
			submitterDonorId: 'Pat-1',
			errors: [
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'radiation_boost',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'reference_radiation_treatment_id',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'radiation_boost',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'reference_radiation_treatment_id',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'radiation_boost',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'reference_radiation_treatment_id',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'radiation_boost',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'reference_radiation_treatment_id',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'radiation_boost',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'reference_radiation_treatment_id',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'radiation_boost',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'reference_radiation_treatment_id',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'radiation_boost',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'reference_radiation_treatment_id',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'radiation_boost',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'UNRECOGNIZED_FIELD',
					fieldName: 'reference_radiation_treatment_id',
					index: 1,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'UNRECOGNIZED_FIELD',
					entityName: 'radiation',
					__typename: 'ClinicalErrorRecord',
				},
			],
			__typename: 'ClinicalErrors',
		},
		{
			donorId: 262508,
			submitterDonorId: 'Pat-2',
			errors: [
				{
					errorType: 'MISSING_REQUIRED_FIELD',
					fieldName: 'specimen_acquisition_interval',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'specimen_acquisition_interval is a required field.',
					entityName: 'specimen',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'MISSING_REQUIRED_FIELD',
					fieldName: 'specimen_anatomic_location',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'specimen_anatomic_location is a required field.',
					entityName: 'specimen',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'MISSING_REQUIRED_FIELD',
					fieldName: 'specimen_acquisition_interval',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'specimen_acquisition_interval is a required field.',
					entityName: 'specimen',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'MISSING_REQUIRED_FIELD',
					fieldName: 'specimen_anatomic_location',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'specimen_anatomic_location is a required field.',
					entityName: 'specimen',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'MISSING_REQUIRED_FIELD',
					fieldName: 'specimen_acquisition_interval',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'specimen_acquisition_interval is a required field.',
					entityName: 'specimen',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'MISSING_REQUIRED_FIELD',
					fieldName: 'specimen_anatomic_location',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'specimen_anatomic_location is a required field.',
					entityName: 'specimen',
					__typename: 'ClinicalErrorRecord',
				},
			],
			__typename: 'ClinicalErrors',
		},
		{
			donorId: 262508,
			submitterDonorId: 'Pat-2',
			errors: [
				{
					errorType: 'MISSING_REQUIRED_FIELD',
					fieldName: 'cancer_type_code',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'cancer_type_code is a required field.',
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'MISSING_REQUIRED_FIELD',
					fieldName: 'lymph_nodes_examined_status',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'lymph_nodes_examined_status is a required field.',
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'lymph_nodes_examined_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: "The 'lymph_nodes_examined_status' field must be submitted.",
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'MISSING_REQUIRED_FIELD',
					fieldName: 'cancer_type_code',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'cancer_type_code is a required field.',
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'MISSING_REQUIRED_FIELD',
					fieldName: 'lymph_nodes_examined_status',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'lymph_nodes_examined_status is a required field.',
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'lymph_nodes_examined_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: "The 'lymph_nodes_examined_status' field must be submitted.",
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'MISSING_REQUIRED_FIELD',
					fieldName: 'cancer_type_code',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'cancer_type_code is a required field.',
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'MISSING_REQUIRED_FIELD',
					fieldName: 'lymph_nodes_examined_status',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: 'lymph_nodes_examined_status is a required field.',
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'lymph_nodes_examined_method',
					index: 2,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message: "The 'lymph_nodes_examined_status' field must be submitted.",
					entityName: 'primary_diagnosis',
					__typename: 'ClinicalErrorRecord',
				},
			],
			__typename: 'ClinicalErrors',
		},
		{
			donorId: 262508,
			submitterDonorId: 'Pat-2',
			errors: [
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'response_to_treatment',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						'\'Partial response\' is not a permissible value. When \'response_to_treatment_criteria_method\' is set to \'iRECIST\', the \'response_to_treatment\' field must be one of the following: \n- "immune complete response (icr)"\n- "immune confirmed progressive disease (icpd)"\n- "immune partial response (ipr)"\n- "immune stable disease (isd)"\n- "immune unconfirmed progressive disease (iupd)"',
					entityName: 'treatment',
					__typename: 'ClinicalErrorRecord',
				},
			],
			__typename: 'ClinicalErrors',
		},
		{
			donorId: 262508,
			submitterDonorId: 'Pat-2',
			errors: [
				{
					errorType: 'INVALID_BY_REGEX',
					fieldName: 'anatomic_site_progression_or_recurrence',
					index: 0,
					info: {
						value: ['Unknown'],
						__typename: 'ClinicalErrorInfo',
					},
					message:
						'The value is not a permissible for this field, it must meet the regular expression: "^[C][0-9]{2}(.[0-9]{1})?$". Examples: C50.1|C18',
					entityName: 'follow_up',
					__typename: 'ClinicalErrorRecord',
				},
				{
					errorType: 'INVALID_BY_SCRIPT',
					fieldName: 'recurrence_stage_group',
					index: 0,
					info: {
						value: null,
						__typename: 'ClinicalErrorInfo',
					},
					message:
						'The recurrence_stage_group must be submitted if the field recurrence_tumour_staging_system is submitted.',
					entityName: 'follow_up',
					__typename: 'ClinicalErrorRecord',
				},
			],
			__typename: 'ClinicalErrors',
		},
	];

	// Collect Error Data
	const { clinicalErrors = [] } = clinicalData;
	const { tableErrors, totalErrorsAmount: totalErrors } = formatTableErrors({
		clinicalErrors,
		aliasedEntityName,
	});

	const hasErrors = totalErrors > 0;

	const sortEntityData = (prev, next) => {
		let sortVal = 0;

		if (hasErrors) {
			// If Current Entity has Errors, Prioritize Data w/ Errors
			const { errorsA, errorsB } = clinicalErrors.reduce(
				(acc, current) => {
					if (current.donorId == prev['donor_id']) {
						acc.errorsA = -1;
					}
					if (current.donorId == next['donor_id']) {
						acc.errorsB = 1;
					}
					return acc;
				},
				{ errorsA: 0, errorsB: 0 },
			);

			sortVal += errorsA + errorsB;
		}

		// Handles Manual User Sorting by Core Completion columns
		const completionSortIndex = completionKeys.indexOf(sortKey);

		if (completionSortIndex) {
			const completionSortKey = completionColumnNames[completionSortIndex];
			const completionA = prev[completionSortKey];
			const completionB = next[completionSortKey];

			sortVal = completionA === completionB ? 0 : completionA > completionB ? -1 : 1;
			sortVal *= desc ? -1 : 1;
		}

		return sortVal;
	};

	// Map Completion Stats + Entity Data
	if (noTableData) {
		showCompletionStats = true;
		records = noDataCompletionStats;
	} else {
		const entityData = clinicalData.clinicalEntities.find(
			(entity) => entity.entityName === aliasedEntityNames[entityType],
		);
		columns = [...entityData.entityFields];
		const { completionStats, entityName } = entityData;
		showCompletionStats = !!(completionStats && entityName === aliasedEntityNames.donor);

		// totalDocs affects pagination and display text
		// If using default query, or using search but not filtering by donor in URL, then we display total number of search results
		// Else we use the total number of results that match our query
		totalDocs =
			(useDefaultQuery && entityType === 'donor') ||
			(!currentDonors.length && totalResults > entityData.totalDocs)
				? totalResults
				: entityData.totalDocs;

		entityData.records.forEach((record) => {
			record.forEach((r) => {
				if (!columns.includes(r.name)) columns.push(r.name);
			});
		});
		if (showCompletionStats) {
			columns.splice(1, 0, ...Object.values(completionColumnHeaders));
		}

		records = entityData.records
			.map((record) => {
				let clinicalRecord = {};
				record.forEach((r) => {
					const displayKey = r.name;
					clinicalRecord[displayKey] = displayKey === 'donor_id' ? `DO${r.value}` : r.value || '';
					if (showCompletionStats && displayKey === 'donor_id') {
						const completionRecord = completionStats.find(
							(stat) => stat.donorId === parseInt(r.value),
						);

						if (!completionRecord) {
							clinicalRecord = { ...clinicalRecord, ...emptyCompletion };
						} else {
							const { coreCompletion, entityData: completionEntityData } = completionRecord;

							coreCompletionFields.forEach((field) => {
								const completionField = completionColumnHeaders[field];
								const isSpecimenField =
									completionField === completionColumnHeaders['normalSpecimens'] ||
									completionField === completionColumnHeaders['tumourSpecimens'];

								if (!isSpecimenField) {
									const completionValue = coreCompletion[field];
									clinicalRecord[completionField] = completionValue || 0;
								} else {
									const {
										specimens: {
											coreCompletionPercentage,
											normalSpecimensPercentage,
											tumourSpecimensPercentage,
											normalSubmissions,
											tumourSubmissions,
										},
									} = completionEntityData;

									if (coreCompletionPercentage === 1) {
										clinicalRecord[completionField] = 1;
									} else {
										const currentPercentage =
											completionField === completionColumnHeaders['normalSpecimens']
												? normalSpecimensPercentage
												: tumourSpecimensPercentage;
										const currentSubmissions =
											completionField === completionColumnHeaders['normalSpecimens']
												? normalSubmissions
												: tumourSubmissions;
										const hasErrors = currentPercentage !== 1;
										const value = hasErrors ? currentSubmissions : currentPercentage;
										clinicalRecord[completionField] = value;
									}
								}
							});
						}
					}
				});

				return clinicalRecord;
			})
			.sort(sortEntityData);
	}

	const getHeaderBorder = (key) =>
		(showCompletionStats && key === completionColumnHeaders.followUps) ||
		(!showCompletionStats && key === 'donor_id') ||
		key === 'FO'
			? styleThickBorder
			: '';

	const [stickyDonorIDColumnsWidth, setStickyDonorIDColumnsWidth] = useState(74);

	const getCellStyles = (state, row, column) => {
		const { original } = row;
		const { id } = column;
		const isCompletionCell =
			showCompletionStats && Object.values(completionColumnHeaders).includes(id);

		const isSpecimenCell =
			isCompletionCell &&
			(id === completionColumnHeaders.normalSpecimens ||
				id === completionColumnHeaders.tumourSpecimens);

		const originalDonorId = original['donor_id'];
		const cellDonorId = parseInt(
			originalDonorId && originalDonorId.includes('DO')
				? originalDonorId.substring(2)
				: originalDonorId,
		);

		const donorErrorData = clinicalErrors
			.filter((donor) => donor.donorId === cellDonorId)
			.map((donor) => donor.errors)
			.flat();

		const columnErrorData =
			donorErrorData.length &&
			donorErrorData.filter(
				(error) =>
					error &&
					(error.entityName === entityType ||
						(aliasedEntityFields.includes(error.entityName) &&
							aliasedEntityNames[entityType] === error.entityName)) &&
					error.fieldName === id,
			);

		const hasClinicalErrors = columnErrorData && columnErrorData.length >= 1;

		let hasCompletionErrors = isCompletionCell && original[id] !== 1;

		if (isSpecimenCell) {
			const completionData = clinicalData.clinicalEntities.find(
				(entity) => entity.entityName === aliasedEntityNames['donor'],
			).completionStats;

			const completionRecord =
				isCompletionCell &&
				completionData.find((stat) => stat.donorId === parseInt(originalDonorId.substr(2)));

			if (completionRecord) {
				const { entityData: completionEntityData } = completionRecord;

				const {
					specimens: { normalSpecimensPercentage, tumourSpecimensPercentage },
				} = completionEntityData;

				const currentPercentage =
					id === completionColumnHeaders['normalSpecimens']
						? normalSpecimensPercentage
						: tumourSpecimensPercentage;

				hasCompletionErrors = currentPercentage !== 1;
			}
		}

		const specificErrorValue =
			hasClinicalErrors &&
			columnErrorData.filter(
				(error) =>
					(error.errorType === 'INVALID_BY_SCRIPT' || error.errorType === 'INVALID_ENUM_VALUE') &&
					(error.info?.value === original[id] ||
						(error.info?.value && error.info.value[0] === original[id]) ||
						(error.info.value === null && !Boolean(original[id]))),
			);

		const fieldError =
			hasClinicalErrors &&
			columnErrorData.filter(
				(error) =>
					(error.errorType === 'UNRECOGNIZED_FIELD' ||
						error.errorType === 'MISSING_REQUIRED_FIELD') &&
					error.fieldName === id,
			);

		const errorState =
			// Completion Stats === 1 indicates Complete
			// 0 is Incomplete, <1 Incorrect Sample / Specimen Ratio
			(isCompletionCell && hasCompletionErrors) ||
			specificErrorValue?.length > 0 ||
			fieldError?.length > 0;

		// use Emotion styling
		const headerDonorIdStyle = css`
			background: white,
			position: absolute,
		`;
		const stickyMarginStyle = css`
			margin-left: ${stickyDonorIDColumnsWidth};
		`;
		const style = css`
			color: ${isCompletionCell && !errorState && theme.colors.accent1_dark};
			background: ${errorState && theme.colors.error_4};
			${getHeaderBorder(id)}
			${column.Header === 'donor_id' && headerDonorIdStyle};
			${column.Header === 'DO' && stickyMarginStyle};
			${column.Header === 'program_id' && !showCompletionStats && stickyMarginStyle};
		`;

		return {
			style,
			isCompletionCell,
			errorState,
		};
	};

	columns = columns.map((key) => {
		return {
			id: key,
			accessorKey: key,
			Header: key,
			minWidth: getColumnWidth(key, showCompletionStats, noTableData),
		};
	});

	if (showCompletionStats) {
		columns = [
			{
				id: 'clinical_core_completion_header',
				meta: { customHeader: true },
				sortingFn: sortEntityData,
				header: () => <ClinicalCoreCompletionHeader />,

				columns: columns.slice(0, 7).map((column, index) => ({
					...column,
					sortingFn: sortEntityData,
					header: (props) => {
						const value = props.header.id;
						const coreCompletionColumnsCount = 7;
						const isLastElement = index === coreCompletionColumnsCount - 1;
						const isSticky = value === 'donor_id';
						const isSorted = props.sorted;

						return <Cell config={{ isLastElement, isSorted, isSticky }}>{value}</Cell>;
					},
					meta: { customCell: true, customHeader: true },
					cell: (context) => {
						const value = context.getValue();
						const isSticky = context.column.id === 'donor_id';

						const { isCompletionCell, errorState, style } = getCellStyles(
							undefined,
							context.row,
							context.column,
						);

						const showSuccessSvg = isCompletionCell && !errorState;

						const content = showSuccessSvg ? (
							<Icon name="checkmark" fill="accent1_dimmed" width="12px" height="12px" />
						) : (
							value
						);

						return (
							<Cell config={{ isSticky }} styles={[style]}>
								{content}
							</Cell>
						);
					},
				})),
			},
			{
				id: 'submitted_donor_data_header',
				meta: { customHeader: true },
				header: () => (
					<TopLevelHeader
						title="SUBMITTED DONOR DATA"
						styles={[
							css`
								text-align: left;
							`,
						]}
					/>
				),
				columns: columns.slice(7),
			},
		];
	}

	const tableMin = totalDocs > 0 ? page * pageSize + 1 : totalDocs;
	const tableMax = totalDocs < (page + 1) * pageSize ? totalDocs : (page + 1) * pageSize;
	const numTablePages = Math.ceil(totalDocs / pageSize);
	const numErrorPages = Math.ceil(totalErrors / errorPageSize);

	return loading ? (
		<DnaLoader
			css={css`
				display: flex;
				justify-content: center;
				width: 100%;
			`}
		/>
	) : noTableData ? (
		<NoDataCell />
	) : (
		<div
			ref={containerRef}
			css={css`
				position: relative;
			`}
		>
			{hasErrors && (
				<div
					id="error-submission-workspace"
					css={css`
						margin: 12px 0px;
					`}
				>
					<ErrorNotification
						level={NOTIFICATION_VARIANTS.ERROR}
						title={`${totalErrors.toLocaleString()} error(s) found on the current page of ${clinicalEntityDisplayNames[
							entityType
						].toLowerCase()} table`}
						subtitle={<Subtitle program={program} />}
						errors={tableErrors}
						columnConfig={errorColumns}
						tableProps={{
							page: errorPage,
							pages: numErrorPages,
							pageSize: errorPageSize,
							sorted: errorSorted,
							onPageChange: (value) => updatePageSettings('page', value),
							onPageSizeChange: (value) => updatePageSettings('pageSize', value),
							onSortedChange: (value) => updatePageSettings('sorted', value),
							// TODO: Test + Update Pagination in #2267
							// https://github.com/icgc-argo/platform-ui/issues/2267
							showPagination: false,
						}}
					/>
				</div>
			)}

			<TableInfoHeaderContainer
				left={
					<Typography
						css={css`
							margin: 0px;
						`}
						variant="data"
					>
						Showing {tableMin} - {tableMax} of {totalDocs} records
					</Typography>
				}
			/>
			<Table
				data={records}
				columns={columns}
				withHeaders
				withSideBorders
				withPagination
				showPageSizeOptions
				withStripes
				enableColumnResizing={false}
				enableSorting
			/>
		</div>
	);
};

export default ClinicalEntityDataTable;
