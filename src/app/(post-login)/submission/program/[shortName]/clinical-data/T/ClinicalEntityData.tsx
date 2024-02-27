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
import CLINICAL_ENTITY_DATA_QUERY from '@/app/gql/clinical/CLINICAL_ENTITY_DATA_QUERY';
import { useClinicalQuery } from '@/app/hooks/useApolloQuery';
import { ContentPlaceholder, DnaLoader, css } from '@icgc-argo/uikit';
import { useEffect, useState } from 'react';
import { aliasedEntityNames } from '../common';
import ClinicalEntityDataTable from './ClinicalEntityDataTable';
import { ErrorTable } from './ErrorTable';
import {
	ClinicalEntitySearchResultResponse,
	CompletionStates,
	aliasSortNames,
	clinicalEntityFields,
	defaultClinicalEntityFilters,
	emptyClinicalDataResponse,
	emptySearchResponse,
} from './common';
import { usePageSettings } from './tableDataRefactor';

export type DonorEntry = {
	row: string;
	isNew: boolean;
	[k: string]: string | number | boolean;
};

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

const defaultErrorPageSettings = {
	page: 0,
	pageSize: 5,
	sorted: [{ id: 'donorId', desc: true }],
};

const validateEntityQueryName = (entityQuery) => {
	const entities = typeof entityQuery === 'string' ? [entityQuery] : entityQuery;
	return entities.map((entityName) => clinicalEntityFields.find((entity) => entity === entityName));
};

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

// query, sort, format data for table, search etc
type ClinicalEntityDataTableProps = {
	entityType: string;
	program: string;
	completionState: CompletionStates;
	currentDonors: number[];
	donorSearchResults: ClinicalEntitySearchResultResponse;
	useDefaultQuery: boolean;
	noData: boolean;
};
const ClinicalEntityData = ({
	entityType,
	program,
	completionState = CompletionStates['all'],
	currentDonors,
	donorSearchResults = emptySearchResponse,
	useDefaultQuery,
	noData,
}: ClinicalEntityDataTableProps) => {
	const { pageSettings, defaultPageSettings, setPageSettings } = usePageSettings({
		useDefaultQuery,
		entityType,
	});
	const { page, pageSize, sorted } = pageSettings;

	const [errorPageSettings, setErrorPageSettings] = useState(defaultErrorPageSettings);
	// reuse hook?
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

	const aliasedEntityName = aliasedEntityNames[entityType];

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
		<>
			{hasErrors && (
				<div
					id="error-submission-workspace"
					css={css`
						margin: 12px 0px;
					`}
				>
					<ErrorTable page={} pageSize={} />
				</div>
			)}
			<ClinicalEntityDataTable
				aliasedEntityName={aliasedEntityName}
				totalResults={totalResults}
				page={page}
				pageSize={pageSize}
			/>
		</>
	);
};

export default ClinicalEntityDataTable;
