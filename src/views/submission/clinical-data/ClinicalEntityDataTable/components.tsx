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
import { PROGRAM_CLINICAL_SUBMISSION_PATH, PROGRAM_SHORT_NAME_PATH } from '@/global/constants';
import CLINICAL_SCHEMA_VERSION from '@/gql/clinical/CLINICAL_SCHEMA_VERSION';
import { useAppConfigContext, useClinicalQuery } from '@/hooks';
import { ContentPlaceholder, Link, css } from '@icgc-argo/uikit';
import urljoin from 'url-join';

export const NoDataCell = () => (
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

export const DashIcon = (
	<svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M1 1H9" stroke="#BABCC2" strokeWidth="2" strokeLinecap="round" />
	</svg>
);

export const Subtitle = ({ program = '' }) => {
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
