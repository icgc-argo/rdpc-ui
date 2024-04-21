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

import { AppConfig } from '@/api/config/config';
import { ReactNode, createContext, useContext } from 'react';

const defaultContext = {
	DOCS_URL_ROOT: '',
	EGO_API_ROOT: '',
	EGO_CLIENT_ID: '',
	EGO_PUBLIC_KEY: '',
	UI_VERSION: '',
	REGION: '',
	DATA_CENTER: '',
	PLATFORM_UI_ROOT: '',
	RECAPTCHA_SITE_KEY: '',
	ARGO_ROOT: '',
	EGO_LOGIN_URL: '',
	DACO_ROOT: '',
	GATEWAY_API_ROOT: '',
	CLINICAL_API_ROOT: '',
};

const AppConfig = createContext<AppConfig>(defaultContext);

export const AppProvider = ({ children, config }: { children: ReactNode; config: any }) => {
	return <AppConfig.Provider value={config}>{children}</AppConfig.Provider>;
};

export const useAppConfigContext = () => {
	const currentContext = useContext(AppConfig);
	return process.env.NEXT_IS_BUILDING === 'true' ? defaultContext : currentContext;
};
