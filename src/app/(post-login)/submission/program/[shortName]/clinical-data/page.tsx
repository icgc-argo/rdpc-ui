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

import Loader from '@/app/components/Loader';
import { pageWithPermissions } from '@/app/components/Page';
import { BreadcrumbTitle, HelpLink, PageHeader } from '@/app/components/PageHeader/PageHeader';
import { SetStateAction } from 'react';
import SearchBar from './components/SearchBar/SearchBar';

const ClinicalDataPageComp = ({ programShortName }: { programShortName: string }) => {
	const isLoading = false;
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
						setModalVisible={function (value: SetStateAction<boolean>): void {
							throw new Error('Function not implemented.');
						}}
						noData={false}
						completionState={undefined}
						setCompletionState={function (value: any): void {
							throw new Error('Function not implemented.');
						}}
						programShortName={''}
						loading={false}
						keyword={''}
						setKeyword={function (value: SetStateAction<string>): void {
							throw new Error('Function not implemented.');
						}}
						useDefaultQuery={false}
						currentDonors={[]}
						setSelectedDonors={function (value: SetStateAction<string>): void {
							throw new Error('Function not implemented.');
						}}
						donorSearchResults={undefined}
						tsvDownloadIds={undefined}
						modalVisible={false}
					/>
					<div>submitted data placeholder</div>
				</>
			)}
		</div>
	);
};

const ClinicalDataPage = ({ params: { shortName } }: { params: { shortName: string } }) => {
	const ClinicalDataWithPermissions = pageWithPermissions(ClinicalDataPageComp, {
		acceptedRoles: ['isRDPCAdmin', 'isDCCAdmin', 'isProgramAdmin', 'isDataSubmitter'],
		programShortName: shortName,
	});
	return <ClinicalDataWithPermissions programShortName={shortName} />;
};

export default ClinicalDataPage;
