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

import Header from '@/app/components/Header';
import { useAppConfigContext } from '@/app/hooks/AppProvider';
import { EGO_JWT_KEY, LOGIN_NONCE } from '@/global/constants';
import { getFilename } from '@/global/utils/stringUtils';
import createEgoUtils from '@icgc-argo/ego-token-utils';
import { DnaLoader } from '@icgc-argo/uikit';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	Suspense,
	createContext,
	useContext,
	useEffect,
	useState,
} from 'react';

declare global {
	interface Navigator {
		msSaveBlob?: (blob: any, defaultName?: string) => boolean;
	}
}

type AuthContextValue = {
	egoJwt: string | undefined;
	setEgoJwt: Dispatch<SetStateAction<string | undefined>>;
	authLoading: boolean;
	setAuthLoading: Dispatch<SetStateAction<boolean>>;
	logIn: (newToken: string) => void;
	logOut: () => void;
	permissions: string[];
	TokenUtils: ReturnType<typeof createEgoUtils>;
	fetchWithEgoToken: typeof fetch;
	downloadFileWithEgoToken: (...inputs: Parameters<typeof fetch>) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
	egoJwt: '',
	setEgoJwt: () => '',
	authLoading: false,
	setAuthLoading: () => false,
	logIn: () => undefined,
	logOut: () => undefined,
	permissions: [],
	TokenUtils: createEgoUtils(''),
	fetchWithEgoToken: fetch,
	downloadFileWithEgoToken: async () => null,
});

export const getStoredToken = () => Cookies.get(EGO_JWT_KEY);

export const storeToken = (egoToken: string) => {
	Cookies.set(EGO_JWT_KEY, egoToken);
};

export function AuthProvider({ children }: { children: ReactNode }) {
	const config = useAppConfigContext();
	const storedToken = getStoredToken();
	const [egoJwt, setEgoJwt] = useState<string | undefined>(undefined);
	const TokenUtils = createEgoUtils(config.EGO_PUBLIC_KEY);
	const router = useRouter();
	const isLoggedIn = !!egoJwt;
	const [authLoading, setAuthLoading] = useState(isLoggedIn);

	const tokenIsValid = !!TokenUtils.isValidJwt(storedToken);
	const isValidJwt = (egoJwt: string) => !!egoJwt && TokenUtils.isValidJwt(egoJwt);

	useEffect(() => {
		if (storedToken && tokenIsValid) {
			setEgoJwt(storedToken);
		}
		setAuthLoading(false);
	}, [storedToken, tokenIsValid]);

	const logIn = (newToken: string) => {
		setAuthLoading(true);
		storeToken(newToken);
		setEgoJwt(newToken);
		setAuthLoading(false);
	};

	const logOut = () => {
		setAuthLoading(true);
		setEgoJwt('');
		Cookies.remove(EGO_JWT_KEY);
		Cookies.remove(LOGIN_NONCE);
		router.push('/');
		setAuthLoading(false);
	};

	const permissions = egoJwt ? TokenUtils.getPermissionsFromToken(egoJwt) : [];

	const fetchWithEgoToken = async (uri, options) => {
		const modifiedOption = {
			...(options || {}),
			headers: { ...((options && options.headers) || {}), authorization: `Bearer ${egoJwt || ''}` },
		};

		return fetch(uri, modifiedOption);
	};

	const downloadFileWithEgoToken = async (uri, options) => {
		const response = await fetchWithEgoToken(uri, options);

		if (!response.ok) {
			const data = await response.json().catch((_) => {
				console.log(`Download request failed and returned non-json response.`);
			});
			throw new Error(
				data?.error || 'Something went wrong with the attempted download. Please try again later.',
			);
		}
		const data = await response.blob();

		const contentDispositionHeader = response.headers.get('content-disposition');
		const filename = contentDispositionHeader ? getFilename(contentDispositionHeader) : '';

		const blob = new Blob([data], { type: data.type || 'application/octet-stream' });
		if (typeof window.navigator.msSaveBlob !== 'undefined') {
			// IE doesn't allow using a blob object directly as link href.
			// Workaround for "HTML7007: One or more blob URLs were
			// revoked by closing the blob for which they were created.
			// These URLs will no longer resolve as the data backing
			// the URL has been freed."
			window.navigator.msSaveBlob(blob, filename);
			return;
		}
		// Other browsers
		// Create a link pointing to the ObjectURL containing the blob
		const blobURL = window.URL.createObjectURL(blob);
		const tempLink = document.createElement('a');
		tempLink.style.display = 'none';
		tempLink.href = blobURL;
		tempLink.setAttribute('download', filename);
		// Safari thinks _blank anchor are pop ups. We only want to set _blank
		// target if the browser does not support the HTML5 download attribute.
		// This allows you to download files in desktop safari if pop up blocking
		// is enabled.
		if (typeof tempLink.download === 'undefined') {
			tempLink.setAttribute('target', '_blank');
		}
		document.body.appendChild(tempLink);
		tempLink.click();
		document.body.removeChild(tempLink);
		setTimeout(() => {
			// For Firefox it is necessary to delay revoking the ObjectURL
			window.URL.revokeObjectURL(blobURL);
		}, 100);
	};

	const value: AuthContextValue = {
		egoJwt,
		setEgoJwt,
		authLoading,
		setAuthLoading,
		logIn,
		logOut,
		permissions,
		TokenUtils,
		downloadFileWithEgoToken,
	};

	return (
		<AuthContext.Provider value={value}>
			<Suspense
				fallback={
					<>
						<Header />
						<DnaLoader />
					</>
				}
			>
				{children}
			</Suspense>
		</AuthContext.Provider>
	);
}

export const useAuthContext = () => useContext(AuthContext);
