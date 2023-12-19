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

import { pageWithPermissions } from '@/app/components/Page';
import { BreadcrumbTitle, HelpLink, PageHeader } from '@/app/components/PageHeader/PageHeader';
import CLINICAL_ENTITY_SEARCH_RESULTS_QUERY from '@/app/gql/CLINICAL_ENTITY_SEARCH_RESULTS_QUERY';
import SUBMITTED_DATA_SIDE_MENU_QUERY from '@/app/gql/SUBMITTED_DATA_SIDE_MENU_QUERY';
import useUrlParamState from '@/app/hooks/useUrlParamState';
import { notNull } from '@/global/utils';
import { css } from '@/lib/emotion';
import { useQuery } from '@apollo/client';
import { useTheme } from '@emotion/react';
import { Container, Loader, Typography, VerticalTabs } from '@icgc-argo/uikit';
import { useEffect, useState } from 'react';
import { setConfiguration } from 'react-grid-system';
import ClinicalEntityDataTable from './ClinicalEntityDataTable';
import ClinicalDownloadButton from './DownloadButtons';
import SearchBar from './SearchBar';
import {
	ClinicalEntitySearchResultResponse,
	CompletionStates,
	TsvDownloadIds,
	aliasedEntityNames,
	clinicalEntityDisplayNames,
	clinicalEntityFields,
	defaultClinicalEntityFilters,
	emptyClinicalDataResponse,
	emptySearchResponse,
	hasClinicalErrors,
	parseDonorIdString,
	reverseLookUpEntityAlias,
} from './common';

setConfiguration({ gutterWidth: 9 });

const defaultClinicalEntityTab = aliasedEntityNames.donor;

// convert codegen automated types to definitions in existing code
// make data object shape uniform
const parseSearchResult = (
	data: ClinicalEntitySearchResultResponse | undefined,
): ClinicalEntitySearchResultResponse => {
	if (!data) return emptySearchResponse;
	return {
		clinicalSearchResults: {
			searchResults: data.clinicalSearchResults.searchResults.map((searchResults) => ({
				donorId: searchResults?.donorId || 0,
				submitterDonorId: searchResults?.submitterDonorId || '',
			})),
			totalResults: data.clinicalSearchResults.totalResults,
		},
	};
};

const ClinicalDataPageComp = ({ programShortName }: { programShortName: string }) => {
	const FEATURE_SUBMITTED_DATA_ENABLED = true;
	const isLoading = false;

	//
	const theme = useTheme();
	const [keyword, setKeyword] = useState('');
	const [completionState, setCompletionState] = useState(CompletionStates['all']);
	const [modalVisible, setModalVisible] = useState(false);

	const [selectedClinicalEntityTab, setSelectedClinicalEntityTab] = useUrlParamState(
		'tab',
		defaultClinicalEntityTab,
	);
	const [selectedDonors, setSelectedDonors] = useUrlParamState('donorId', 'donorId');

	const currentEntity = reverseLookUpEntityAlias(selectedClinicalEntityTab);
	const urlDonorQueryStrings = selectedDonors ? selectedDonors.split(',') : [];
	const currentDonors = urlDonorQueryStrings.length
		? urlDonorQueryStrings.map((donorId) => parseDonorIdString(donorId))
		: [];

	// Matches multiple digits and/or digits preceded by DO, followed by a comma, space, or end of string
	// Example: DO259138, 2579137, DASH-7, DO253290abcdef
	// Regex will match first 2 Donor IDs, but not 3rd Submitter ID or 4th case w/ random text
	const searchDonorIds =
		keyword
			.match(/(?=DO|\d)\d+(?=,| |$)/gi)
			?.filter((match) => !!match)
			.map((idString) => parseInt(idString)) || [];

	// Matches 'D' or 'DO' exactly (case insensitive)
	const donorPrefixSearch = keyword.match(/^(d|do)\b/gi);

	const searchSubmitterIds = donorPrefixSearch
		? []
		: keyword.split(/, |,/).filter((word) => !!word);

	// Search Result Query
	// Populates dropdown menu; Search query populates data table if there are no URL params
	const { data: searchResultData, loading: searchResultsLoading } = useQuery(
		CLINICAL_ENTITY_SEARCH_RESULTS_QUERY,
		{
			errorPolicy: 'all',
			variables: {
				programShortName,
				filters: {
					...defaultClinicalEntityFilters,
					completionState,
					entityTypes: [currentEntity],
					donorIds: searchDonorIds,
					submitterDonorIds: searchSubmitterIds,
				},
			},
		},
	);

	const parsedSearchResultData = parseSearchResult(searchResultData);

	const searchResults = parsedSearchResultData?.clinicalSearchResults?.searchResults;
	const searchResultIds = searchResults.map((result) => result?.donorId).filter(notNull);

	const sideMenuQueryDonorIds =
		urlDonorQueryStrings.length > 0
			? currentDonors
			: searchResults.length > 0 && keyword.length > 0
			? searchResultIds
			: [];

	// Side Menu Query
	// Populates Clinical Entity Table, Side Menu, Title Bar
	const { data: sideMenuQuery, loading: sideMenuLoading } = useQuery(
		SUBMITTED_DATA_SIDE_MENU_QUERY,
		{
			errorPolicy: 'all',
			variables: {
				programShortName,
				filters: {
					...defaultClinicalEntityFilters,
					completionState,
					donorIds: sideMenuQueryDonorIds,
				},
			},
		},
	);

	useEffect(() => {
		//setGlobalLoading(sideMenuLoading);
		console.log('.....global loading....');
	}, [sideMenuLoading]);

	const sideMenuData =
		sideMenuQuery == undefined || sideMenuLoading || !FEATURE_SUBMITTED_DATA_ENABLED
			? emptyClinicalDataResponse
			: sideMenuQuery;

	const { clinicalData } = sideMenuData;

	const useDefaultQuery =
		currentDonors.length === 0 &&
		(donorPrefixSearch || (searchDonorIds.length === 0 && searchSubmitterIds.length === 0)) &&
		completionState === 'all';

	const noSearchData = searchResultData === null || searchResultData === undefined;
	const noData =
		clinicalData.clinicalEntities.length === 0 && noSearchData && currentDonors.length === 0;

	const entityTableDonorIds =
		currentDonors.length > 0 ? currentDonors : searchResults.length > 0 ? searchResultIds : [];

	const entityTableSubmitterDonorIds = (searchResults || [])
		.map((searchResults) => searchResults?.submitterDonorId)
		.filter(Boolean);

	const tsvDownloadIds: TsvDownloadIds = {
		donorIds: useDefaultQuery ? [] : entityTableDonorIds,
		submitterDonorIds: useDefaultQuery ? [] : entityTableSubmitterDonorIds.filter(notNull),
	};

	//
	const menuItems = clinicalEntityFields.map((entity) => (
		<VerticalTabs.Item
			key={entity}
			active={selectedClinicalEntityTab === aliasedEntityNames[entity]}
			onClick={() => setSelectedClinicalEntityTab(aliasedEntityNames[entity])}
			disabled={
				false //!clinicalData.clinicalEntities.some((e) => e?.entityName === aliasedEntityNames[entity])
			}
		>
			{clinicalEntityDisplayNames[entity]}
			{hasClinicalErrors(clinicalData, entity) && (
				<VerticalTabs.Tag variant="ERROR">!</VerticalTabs.Tag>
			)}
		</VerticalTabs.Item>
	));

	return (
		<div>
			<PageHeader
				leftSlot={<BreadcrumbTitle breadcrumbs={[programShortName, 'Submitted Data']} />}
				rightSlot={<HelpLink url="" />}
			/>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<SearchBar
						setModalVisible={setModalVisible}
						modalVisible={modalVisible}
						completionState={completionState}
						setCompletionState={setCompletionState}
						programShortName={programShortName}
						keyword={keyword}
						loading={searchResultsLoading}
						noData={noData}
						useDefaultQuery={useDefaultQuery}
						currentDonors={currentDonors}
						setSelectedDonors={setSelectedDonors}
						tsvDownloadIds={tsvDownloadIds}
						donorSearchResults={parsedSearchResultData}
						setKeyword={setKeyword}
					/>
					<Container>
						<div
							css={css`
								width: 100%;
							`}
						>
							{/* Sidebar */}
							<div
								css={css`
									width: 20%;
									max-width: 170px;
									display: inline-block;
									border: 1px solid ${theme.colors.grey_2};
								`}
							>
								<VerticalTabs>{menuItems}</VerticalTabs>
							</div>
							{/* Content */}
							<div
								css={css`
									display: inline-block;
									height: 100%;
									width: calc(97% - 170px);
									vertical-align: top;
									padding: 8px 12px;
								`}
							>
								{/* Header */}
								<div
									css={css`
										width: 100%;
										display: flex;
										justify-content: space-between;
									`}
								>
									<Typography
										variant="subtitle2"
										css={css`
											margin-top: 4px;
											margin-left: 4px;
										`}
									>
										{clinicalEntityDisplayNames[currentEntity]} Data
									</Typography>

									<ClinicalDownloadButton
										tsvDownloadIds={tsvDownloadIds}
										text={`${clinicalEntityDisplayNames[currentEntity]} Data`}
										entityTypes={[currentEntity]}
										completionState={completionState}
										disabled={noData}
									/>
								</div>
								{/* DataTable */}
								<div>
									<ClinicalEntityDataTable
										entityType={currentEntity}
										program={programShortName}
										completionState={completionState}
										currentDonors={entityTableDonorIds}
										donorSearchResults={searchResultData}
										useDefaultQuery={useDefaultQuery}
										noData={noData}
									/>
								</div>
							</div>{' '}
						</div>
					</Container>
				</>
			)}
		</div>
	);
};

const ClinicalDataPage = ({ params: { shortName = '' } }: { params: { shortName: string } }) => {
	const ClinicalDataWithPermissions = pageWithPermissions(ClinicalDataPageComp, {
		acceptedRoles: ['isRDPCAdmin', 'isDCCAdmin', 'isProgramAdmin', 'isDataSubmitter'],
		programShortName: shortName,
	});
	return <ClinicalDataWithPermissions programShortName={shortName} />;
};

export default ClinicalDataPage;
