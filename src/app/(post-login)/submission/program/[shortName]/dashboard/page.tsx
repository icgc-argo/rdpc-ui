/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import ContentMain from '@/app/components/Content/ContentMain';
import { pageWithPermissions } from '@/app/components/Page';
import { BreadcrumbTitle, HelpLink, PageHeader } from '@/app/components/PageHeader/PageHeader';
import { useAppConfigContext } from '@/app/hooks';
import { css, styled } from '@/lib/emotion';
import { Col, Row, ScreenClassRender, setConfiguration } from 'react-grid-system';
import urlJoin from 'url-join';
import ClinicalChart from './components/ClinicalChart';
import DonorDataSummary from './components/DonorDataSummary';
import DonorReleaseSummary from './components/DonorReleaseSummary';
import ProgramWorkplaceStatus from './components/ProgramWorkspaceStatus';
import StatsBar from './components/StatsBar';

setConfiguration({ gutterWidth: 9 });

type StackedSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

const Dashboard = ({ shortName }: { shortName: string }) => {
	// docs url
	const { DOCS_URL_ROOT } = useAppConfigContext();
	const helpUrl = urlJoin(DOCS_URL_ROOT, '/docs/submission/submitted-data');

	const PaddedRow = styled(Row)`
		padding-bottom: 8px;
	`;

	const applyStackedStyle = (size: StackedSizes) => css`
		padding-bottom: ${['xl'].includes(size) ? '0' : '8'}px;
	`;

	return (
		<div
			css={css`
				display: flex;
				flex-direction: column;
			`}
		>
			<PageHeader
				leftSlot={<BreadcrumbTitle breadcrumbs={[shortName, 'Dashboard']} />}
				rightSlot={<HelpLink url={helpUrl} />}
			/>
			<ContentMain>
				<PaddedRow justify="around">
					<Col xs={12}>
						<StatsBar programShortName={shortName} />
					</Col>
				</PaddedRow>

				<PaddedRow justify="between">
					<Col xl={4} lg={12}>
						<PaddedRow>
							<Col xs={12}>
								<DonorReleaseSummary programShortName={shortName} />
							</Col>
						</PaddedRow>
						<Row>
							<ScreenClassRender
								render={(screenClass) => (
									<Col xs={12} css={applyStackedStyle(screenClass)}>
										<ProgramWorkplaceStatus programShortName={shortName} />
									</Col>
								)}
							/>
						</Row>
					</Col>
					<ScreenClassRender
						render={(screenClass: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl') => (
							<Col xl={4} lg={12} css={applyStackedStyle(screenClass)}>
								<ClinicalChart
									chartType="clinical"
									title="Completed Core Clinical Data"
									programShortName={shortName}
								/>
							</Col>
						)}
					/>
					<ScreenClassRender
						render={(screenClass: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => (
							<Col xl={4} lg={12} css={applyStackedStyle(screenClass)}>
								<ClinicalChart
									chartType="molecular"
									title="Molecular Data Summary"
									programShortName={shortName}
								/>
							</Col>
						)}
					/>
				</PaddedRow>
				<PaddedRow>
					<Col xs={12}>
						<DonorDataSummary programShortName={shortName} />
					</Col>
				</PaddedRow>
			</ContentMain>
		</div>
	);
};

const DashboardPage = ({ params: { shortName } }: { params: { shortName: string } }) => {
	const Page = pageWithPermissions(Dashboard, {
		acceptedRoles: ['isProgramAdmin', 'isDataSubmitter', 'isRDPCAdmin', 'isDCCAdmin'],
		programShortName: shortName,
	});

	return <Page shortName={shortName} />;
};

export default DashboardPage;
