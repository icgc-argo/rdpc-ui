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

import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';
import urlJoin from 'url-join';

import { css, DnaLoader, useTheme } from '@icgc-argo/uikit';
import { getAppConfig } from '@/global/config';
import { storeToken, useAuthContext } from '@/global/utils/auth';

export default async function LoggingIn() {
	const { EGO_API_ROOT, EGO_CLIENT_ID } = getAppConfig();
	const router = useRouter();
	const theme = useTheme();
	const { egoJwt, setEgoJwt, loggingIn, setLoggingIn } = useAuthContext();
	const egoLoginUrl = urlJoin(EGO_API_ROOT, `/api/oauth/ego-token?client_id=${EGO_CLIENT_ID}`);

	if (egoJwt) router.push('/landing-page');

	if (!loggingIn && !egoJwt) setLoggingIn(true);

	useQuery('egoJwt', () => {
		fetch(egoLoginUrl, {
			credentials: 'include',
			headers: { accept: '*/*' },
			body: null,
			method: 'GET',
			mode: 'cors',
		})
			.then(async (res) => {
				const newToken = await res.text();
				storeToken(newToken);
				setEgoJwt(newToken);
				setLoggingIn(false);
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
