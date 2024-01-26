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

import ContentMain from '@/app/components/Content/ContentMain';
import { pageWithPermissions } from '@/app/components/Page';
import { BreadcrumbTitle, HelpLink, PageHeader } from '@/app/components/PageHeader/PageHeader';
import { useAppConfigContext } from '@/app/hooks/AppProvider';
import { css, styled } from '@/lib/emotion';
import { Col, Row, ScreenClassRender } from 'react-grid-system';
import urlJoin from 'url-join';

// <SubmissionLayout
// subtitle={`${programShortName} Dashboard`}
// contentHeader={
//   <div
//     css={css`
//       display: flex;
//       justify-content: space-between;
//       align-items: center;
//       width: 100%;
//     `}
//   >
//     <TitleBar>
//       <>{programShortName}</>
//       <Row nogutter align="center">
//         <div
//           css={css`
//             margin-right: 20px;
//           `}
//         >
//           Dashboard
//         </div>
//       </Row>
//     </TitleBar>
//     <Link
//       target="_blank"
//       href={DOCS_SUBMITTED_DATA_PAGE}
//       bold
//       withChevron
//       uppercase
//       underline={false}
//       css={css`
//         font-size: 14px;
//       `}
//     >
//       HELP
//     </Link>
//   </div>
// }
// >

const Dashboard = ({ shortName }: { shortName: string }) => {
	// docs url
	const { DOCS_URL_ROOT } = useAppConfigContext();
	const helpUrl = urlJoin(DOCS_URL_ROOT, '/docs/submission/submitted-data');

	const PaddedRow = styled(Row)`
		padding-bottom: 8px;
	`;

	const applyStackedStyle = (size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl') => css`
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
						<div>stats bar</div>
					</Col>
				</PaddedRow>

				<PaddedRow justify="between">
					<Col xl={4} lg={12}>
						<PaddedRow>
							<Col xs={12}>
								<div>Donor release summary</div>
							</Col>
						</PaddedRow>
						<Row>
							<ScreenClassRender
								render={(screenClass) => (
									<Col xs={12} css={applyStackedStyle(screenClass)}>
										<div>Program workspace status</div>
									</Col>
								)}
							/>
						</Row>
					</Col>
					<ScreenClassRender
						render={(screenClass: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl') => (
							<Col xl={4} lg={12} css={applyStackedStyle(screenClass)}>
								<div>Clinical chart</div>{' '}
							</Col>
						)}
					/>
					<ScreenClassRender
						render={(screenClass: 'xs' | 'sm' | 'md' | 'lg' | 'xl') => (
							<Col xl={4} lg={12} css={applyStackedStyle(screenClass)}>
								<div>clinical chart</div>
							</Col>
						)}
					/>
				</PaddedRow>
				<PaddedRow>
					<Col xs={12}>
						<div>Donor Data</div>
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
