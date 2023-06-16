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

import { createContext, Dispatch, ReactNode, SetStateAction, useContext } from 'react';
import Cookies from 'js-cookie';
import { EGO_JWT_KEY } from '../constants';

type AuthContextValue = {
	egoJwt: string;
	setEgoJwt: Dispatch<SetStateAction<string>>;
	loggingIn: boolean;
	setLoggingIn: Dispatch<SetStateAction<boolean>>;
};

const AuthContext = createContext<AuthContextValue>({
	egoJwt: '',
	setEgoJwt: () => {},
	loggingIn: false,
	setLoggingIn: () => false,
});

export const getToken = () => Cookies.get(EGO_JWT_KEY) || '';

export const storeToken = (egoToken: string) => {
	const { setEgoJwt } = useAuthContext();
	Cookies.set(EGO_JWT_KEY, egoToken);
	setEgoJwt(egoToken);
};

const removeToken = () => {
	Cookies.remove(EGO_JWT_KEY);
};

export const logOut = () => {
	removeToken();
	// Clear Context, etc.
};

export function AuthProvider({
	authData,
	children,
}: {
	authData: AuthContextValue;
	children: ReactNode;
}) {
	return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
