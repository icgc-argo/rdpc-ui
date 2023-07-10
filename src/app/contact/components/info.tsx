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

import {
	DACO_ROOT,
	DOCS_API_TOKEN_PAGE,
	DOCS_DATA_ACCESS_PAGE,
	DOCS_DATA_DOWNLOAD_PAGE,
	DOCS_REGISTERING_SAMPLES_PAGE,
	DOCS_SUBMISSION_OVERVIEW_PAGE,
	DOCS_SUBMITTING_CLINICAL_DATA_PAGE,
	DOCS_SUBMITTING_MOLECULAR_DATA_PAGE,
	DOCS_URL_ROOT,
} from '@/global/urls';
import { Button, Link, Typography, css, useTheme } from '@icgc-argo/uikit';
import { Col } from 'react-grid-system';

const Info = () => {
	const theme = useTheme();
	return (
		<Col
			md={12}
			lg={6}
			style={{
				padding: '0px 47px 0px 47px',
				backgroundColor: theme.colors.white,
			}}
		>
			<Typography
				variant="hero"
				css={css({
					margin: '28px 0',
				})}
			>
				Contact
			</Typography>
			<Typography
				variant="subtitle2"
				css={css({
					margin: '21px 0',
				})}
			>
				You may find the answer to your question in the following common topics:
			</Typography>

			<div
				css={css`
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					row-gap: 40px;
					margin-top: 10px;
				`}
			>
				<div>
					<Typography
						css={css`
							margin: 0;
						`}
						variant="sectionHeader"
						color="secondary"
						bold
						as="div"
					>
						Accessing Controlled Data{' '}
					</Typography>
					You will need to{' '}
					<Link target="_blank" rel="noreferrer noopener" href={DACO_ROOT}>
						apply to ICGC DACO
					</Link>{' '}
					in order to access controlled data. Visit our documentation for assistance with{' '}
					<Link target="_blank" rel="noreferrer noopener" href={DOCS_DATA_ACCESS_PAGE}>
						applying for access to controlled data.
					</Link>
				</div>
				<div>
					<Typography
						css={css`
							margin: 0;
						`}
						variant="sectionHeader"
						color="secondary"
						bold
						as="div"
					>
						Downloading Data
					</Typography>
					<ul>
						<li>
							<Link target="_blank" rel="noreferrer noopener" href={DOCS_DATA_DOWNLOAD_PAGE}>
								How to download data
							</Link>{' '}
							using the API Token and score-client
						</li>
						<li>
							<Link target="_self" href={DOCS_API_TOKEN_PAGE}>
								User profile and API token{' '}
							</Link>
						</li>
					</ul>
				</div>
				<div>
					<Typography
						css={css`
							margin: 0;
						`}
						variant="subtitle2"
						color="secondary"
						bold
						as="div"
					>
						Submitting Data
					</Typography>
					<ul>
						<li>
							<Link target="_blank" rel="noreferrer noopener" href={DOCS_SUBMISSION_OVERVIEW_PAGE}>
								Get started:
							</Link>{' '}
							a quick guide to data submission
						</li>
						<li>
							How to{' '}
							<Link target="_blank" rel="noreferrer noopener" href={DOCS_REGISTERING_SAMPLES_PAGE}>
								register samples
							</Link>
						</li>
						<li>
							How to{' '}
							<Link
								target="_blank"
								rel="noreferrer noopener"
								href={DOCS_SUBMITTING_CLINICAL_DATA_PAGE}
							>
								submit clinical data
							</Link>
						</li>
						<li>
							How to{' '}
							<Link
								target="_blank"
								rel="noreferrer noopener"
								href={DOCS_SUBMITTING_MOLECULAR_DATA_PAGE}
							>
								submit molecular data
							</Link>
						</li>
					</ul>
				</div>

				<div>
					<Button variant="secondary">
						<Link underline={false} target="_blank" rel="noreferrer noopener" href={DOCS_URL_ROOT}>
							More Documentation
						</Link>
					</Button>
				</div>
			</div>
		</Col>
	);
};

export default Info;
