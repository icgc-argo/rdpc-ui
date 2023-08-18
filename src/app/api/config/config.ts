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

import urljoin from 'url-join';
import packageJSON from '../../../../package.json';

export type AppConfig = {
	DOCS_URL_ROOT: string;
	EGO_API_ROOT: string;
	EGO_CLIENT_ID: string;
	EGO_PUBLIC_KEY: string;
	REGION: string;
	UI_VERSION: string;
	PLATFORM_UI_ROOT: string;
	RECAPTCHA_SITE_KEY: string;
	ARGO_ROOT: string;
	EGO_LOGIN_URL: string;
	DACO_ROOT: string;
};

/**
 * returns app config env vars
 * order of priority: server runtime > process.env build time > default
 */
export const getAppConfig = (serverEnv: any): AppConfig => {
	/**
	 * keep explicit style of: Server || Client to prevent errors with Next inlining build variables
	 */

	const EGO_API_ROOT =
		serverEnv.NEXT_PUBLIC_EGO_API_ROOT ||
		process.env.NEXT_PUBLIC_EGO_API_ROOT ||
		'http://localhost:8081';
	const EGO_CLIENT_ID =
		serverEnv.NEXT_PUBLIC_EGO_CLIENT_ID || process.env.NEXT_PUBLIC_EGO_CLIENT_ID || 'rdpc-ui-local';
	const EGO_LOGIN_URL = urljoin(
		EGO_API_ROOT,
		'/api/oauth/login/google',
		`?client_id=${EGO_CLIENT_ID}`,
	);

	const config = {
		DOCS_URL_ROOT:
			serverEnv.NEXT_PUBLIC_DOCS_URL_ROOT ||
			process.env.NEXT_PUBLIC_DOCS_URL_ROOT ||
			'https://docs.icgc-argo.org/',
		EGO_PUBLIC_KEY:
			serverEnv.NEXT_PUBLIC_EGO_PUBLIC_KEY || process.env.NEXT_PUBLIC_EGO_PUBLIC_KEY || '',
		UI_VERSION: packageJSON.version,
		REGION: serverEnv.NEXT_PUBLIC_REGION || process.env.NEXT_PUBLIC_REGION || '',
		PLATFORM_UI_ROOT:
			serverEnv.NEXT_PUBLIC_PLATFORM_UI_ROOT || process.env.NEXT_PUBLIC_PLATFORM_UI_ROOT || '',
		RECAPTCHA_SITE_KEY:
			serverEnv.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
		ARGO_ROOT: serverEnv.ARGO_ROOT || process.env.ARGO_ROOT || 'https://www.icgc-argo.org',
		EGO_API_ROOT,
		EGO_CLIENT_ID,
		EGO_LOGIN_URL,
		DACO_ROOT: serverEnv.DACO_ROOT || process.env.DACO_ROOT || 'https://daco.icgc-argo.org/',
	};

	return config;
};
