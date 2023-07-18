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

import { getAppConfig } from '@/global/config';
import urljoin from 'url-join';

const { DOCS_URL_ROOT, PLATFORM_UI_ROOT, EGO_API_ROOT, EGO_CLIENT_ID } = getAppConfig();

// ARGO
export const ARGO_ROOT = 'https://www.icgc-argo.org';
export const ARGO_PRIVACY_PAGE = urljoin(ARGO_ROOT, '/page/2/privacy');
export const ARGO_TERMS_PAGE = urljoin(ARGO_ROOT, '/page/1/terms-and-conditions');
export const ARGO_PUBLICATION_PAGE = urljoin(ARGO_ROOT, '/page/77/e3-publication-policy');

// Docs
export const DOCS_DATA_ACCESS_PAGE = urljoin(DOCS_URL_ROOT, '/docs/data-access/daco/applying');
export const DOCS_DATA_DOWNLOAD_PAGE = urljoin(DOCS_URL_ROOT, '/docs/data-access/data-download');
export const DOCS_API_TOKEN_PAGE = urljoin(
	DOCS_URL_ROOT,
	'/docs/data-access/user-profile-and-api-token',
);
export const DOCS_SUBMISSION_OVERVIEW_PAGE = urljoin(
	DOCS_URL_ROOT,
	'/docs/submission/submission-overview',
);
export const DOCS_REGISTERING_SAMPLES_PAGE = urljoin(
	DOCS_URL_ROOT,
	'/docs/submission/registering-samples',
);
export const DOCS_SUBMITTING_CLINICAL_DATA_PAGE = urljoin(
	DOCS_URL_ROOT,
	'/docs/submission/submitting-clinical-data',
);
export const DOCS_SUBMITTING_MOLECULAR_DATA_PAGE = urljoin(
	DOCS_URL_ROOT,
	'/docs/submission/submitting-molecular-data',
);

export { DOCS_URL_ROOT };

// Daco
export const DACO_ROOT = 'https://daco.icgc-argo.org/';

// Platform
export { PLATFORM_UI_ROOT };

// Ego
export const EGO_LOGIN_URL = urljoin(
	EGO_API_ROOT,
	'/api/oauth/login/google',
	`?client_id=${EGO_CLIENT_ID}`,
);
