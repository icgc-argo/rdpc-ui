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

import { createContext, Dispatch, ReactNode, SetStateAction, useState, useContext } from 'react';
import Cookies from 'js-cookie';
import { EGO_JWT_KEY } from './constants';

type AuthContextValue = {
	egoJwt: string;
	setEgoJwt: Dispatch<SetStateAction<string>>;
};

const AuthContext = createContext<AuthContextValue>({
	egoJwt: '',
	setEgoJwt: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

const removeToken = () => {
	Cookies.remove(EGO_JWT_KEY);
};

export const logOut = () => {
	removeToken();
};

export default function AuthProvider({ children }: { children: ReactNode }) {
	const storedToken = Cookies.get(EGO_JWT_KEY);
	const [egoJwt, setEgoJwt] = useState(storedToken || '');
	const authData = { egoJwt, setEgoJwt };
	return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
}
