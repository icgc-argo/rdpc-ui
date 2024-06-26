/*
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
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

import { useAppConfigContext } from '@/hooks';
import { ContentPlaceholder, css, Link, styled, Typography } from '@icgc-argo/uikit';
import urljoin from 'url-join';

const NoDataIcon = styled('img')`
	padding: 0px 16px;
	max-width: 100vw;
`;

const EmptyDonorSummaryState = () => {
	const { DOCS_URL_ROOT } = useAppConfigContext();
	const DOCS_SUBMITTED_DATA_PAGE = urljoin(DOCS_URL_ROOT, '/docs/submission/submitted-data');

	const getStartedLink = (
		<Typography variant="data" component="span">
			<Link target="_blank" href={DOCS_SUBMITTED_DATA_PAGE}>
				Read more about the donor data summary »
			</Link>
		</Typography>
	);

	return (
		<ContentPlaceholder title="You do not have any donor data submitted." link={getStartedLink}>
			<div
				css={css`
					display: flex;
					flex-wrap: wrap;
					justify-content: space-around;
					max-height: 100%;
				`}
			>
				<NoDataIcon alt="no data found" src={'/assets/register.svg'} />
				<NoDataIcon alt="no data found" src={'/assets/clinical.svg'} />
				<NoDataIcon alt="no data found" src={'/assets/dna.svg'} />
			</div>
		</ContentPlaceholder>
	);
};

export default EmptyDonorSummaryState;
