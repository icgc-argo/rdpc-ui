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

import packageJSON from '../../package.json';

type AppConfig = {
	DOCS_URL_ROOT: string;
	EGO_API_ROOT: string;
	EGO_CLIENT_ID: string;
	EGO_PUBLIC_KEY: string;
	REGION: string;
	UI_VERSION: string;
	PLATFORM_UI_ROOT: string;
	RECAPTCHA_SITE_KEY: string;
};

export const getAppConfig = (): AppConfig => {
	return {
		DOCS_URL_ROOT: process.env.NEXT_PUBLIC_DOCS_URL_ROOT || 'https://docs.icgc-argo.org/',
		EGO_API_ROOT: process.env.NEXT_PUBLIC_EGO_API_ROOT || 'http://localhost:8081',
		EGO_CLIENT_ID: process.env.NEXT_PUBLIC_EGO_CLIENT_ID || 'rdpc-ui-local',
		EGO_PUBLIC_KEY: process.env.NEXT_PUBLIC_EGO_PUBLIC_KEY || '',
		UI_VERSION: packageJSON.version,
		REGION: process.env.NEXT_PUBLIC_REGION || '',
		PLATFORM_UI_ROOT: process.env.NEXT_PUBLIC_PLATFORM_UI_ROOT || '',
		RECAPTCHA_SITE_KEY: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '',
	};
};
