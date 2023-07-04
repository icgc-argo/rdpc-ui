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

import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { css, DnaLoader, useTheme } from '@icgc-argo/uikit';
import { useQuery } from 'react-query';
import urljoin from 'url-join';
import { EGO_JWT_KEY } from '@/global/constants';
import { getAppConfig } from '@/global/config';
import { useAuthContext } from '@/global/auth';

export default async function CreatePage() {
	const { EGO_CLIENT_ID, EGO_API_ROOT } = getAppConfig();
	const egoLoginUrl = urljoin(EGO_API_ROOT, `/api/oauth/ego-token?client_id=${EGO_CLIENT_ID}`);
	const { setEgoJwt } = useAuthContext();
	const router = useRouter();
	const theme = useTheme();

	useQuery('egoJwt', () => {
		fetch(egoLoginUrl, {
			credentials: 'include',
			headers: { accept: '*/*' },
			body: null,
			method: 'GET',
			mode: 'cors',
		})
			.then(async (res: Response) => {
				const egoToken = await res.text();
				Cookies.set(EGO_JWT_KEY, egoToken);
				setEgoJwt(egoToken);
				router.push('/landing-page');
			})
			.catch((err) => {
				console.warn('err: ', err);
			});
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
