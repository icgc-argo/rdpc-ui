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

type AuthContextValue = {
	egoJwt: string;
	setEgoJwt: Dispatch<SetStateAction<string>>;
	authLoading: boolean;
	setAuthLoading: Dispatch<SetStateAction<boolean>>;
	logIn: (newToken: string) => void;
	logOut: () => void;
	permissions: string[];
	TokenUtils: ReturnType<typeof createEgoUtils>;
	userPrograms: string[];
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
	userPrograms: [],
});

export const getStoredToken = () => Cookies.get(EGO_JWT_KEY);

export const storeToken = (egoToken: string) => {
	Cookies.set(EGO_JWT_KEY, egoToken);
};

export function AuthProvider({ children }: { children: ReactNode }) {
	const config = useAppConfigContext();
	const storedToken = getStoredToken();
	const [egoJwt, setEgoJwt] = useState('');

	useEffect(() => {
		if (storedToken) {
			setEgoJwt(storedToken);
		}
		setAuthLoading(false);
	}, [storedToken]);

	const TokenUtils = createEgoUtils(config.EGO_PUBLIC_KEY);
	const router = useRouter();
	const loginStateOnPageLoad = !egoJwt?.length;
	const [authLoading, setAuthLoading] = useState(loginStateOnPageLoad);

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

	const permissions =
		(TokenUtils.isValidJwt(egoJwt) && TokenUtils.getPermissionsFromToken(egoJwt)) || [];

	const userPrograms = [
		...TokenUtils.getReadableProgramDataNames(permissions),
		...TokenUtils.getWritableProgramDataNames(permissions),
	];

	const value: AuthContextValue = {
		egoJwt,
		setEgoJwt,
		authLoading,
		setAuthLoading,
		logIn,
		logOut,
		permissions,
		TokenUtils,
		userPrograms,
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
