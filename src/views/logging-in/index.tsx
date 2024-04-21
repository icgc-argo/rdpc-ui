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

import { useAppConfigContext, useAuthContext } from '@/hooks';
import { DnaLoader, css, useTheme } from '@icgc-argo/uikit';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';

export default async function LoggingIn() {
	const { EGO_API_ROOT, EGO_CLIENT_ID } = useAppConfigContext();
	const router = useRouter();
	const theme = useTheme();
	const { egoJwt, authLoading, setAuthLoading, logIn } = useAuthContext();
	const EGO_TOKEN_URL = `${EGO_API_ROOT}/api/oauth/ego-token?client_id=${EGO_CLIENT_ID}`;

	if (egoJwt) router.push('/submission/program');

	if (!authLoading && !egoJwt) setAuthLoading(true);

	useQuery('egoJwt', () => {
		fetch(EGO_TOKEN_URL, {
			credentials: 'include',
			headers: { accept: '*/*' },
			body: null,
			method: 'GET',
		})
			.then(async (res) => {
				const newToken = await res.text();
				logIn(newToken);
			})
			.catch(console.error);
	});

	return (
		<div
			css={css`
				background-color: ${theme.colors.grey_4};
				display: flex;
				justify-content: center;
				align-items: center;
			`}
		>
			<DnaLoader />
		</div>
	);
}
