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

import { useAppConfigContext } from '@/app/components/ConfigProvider';
import { useAuthContext } from '@/global/utils/auth';
import { DnaLoader, css, useTheme } from '@icgc-argo/uikit';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query';

export default async function LoggingIn() {
	const { EGO_LOGIN_URL } = useAppConfigContext();
	const router = useRouter();
	const theme = useTheme();
	const { egoJwt, authLoading, setAuthLoading, logIn } = useAuthContext();

	if (egoJwt) router.push('/landing-page');

	if (!authLoading && !egoJwt) setAuthLoading(true);

	useQuery('egoJwt', () => {
		fetch(EGO_LOGIN_URL, {
			credentials: 'include',
			headers: { accept: '*/*' },
			body: null,
			method: 'GET',
			mode: 'cors',
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
