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
import Image from 'next/image';
import Router from 'next/router';
import { useEffect } from 'react';
import urljoin from 'url-join';
import { EGO_JWT_KEY } from '../../global/constants';
import { getAppConfig } from '../../global/config';
import { removeToken } from '../../global/hooks/auth';

// const redirect = (res: Response, url: string) => {
// 	if (res) {
// 		res.writeHead(302, {
// 			Location: url,
// 		});
// 		res.end();
// 	} else {
// 		Router.push(url);
// 	}
// };

export default function Home() {
	const { EGO_CLIENT_ID, EGO_API_ROOT } = getAppConfig();

	useEffect(() => {
		const egoLoginUrl = urljoin(EGO_API_ROOT, `/api/oauth/ego-token?client_id=${EGO_CLIENT_ID}`);
		fetch(egoLoginUrl, {
			credentials: 'include',
			headers: { accept: '*/*' },
			body: null,
			method: 'GET',
			mode: 'cors',
		})
			.then((res) => res.text())
			.then((egoToken) => {
				Cookies.set(EGO_JWT_KEY, egoToken);
				// redirect(egoToken);
			})
			.catch((err) => {
				console.warn('err: ', err);
				// redirect(null);
			});
	});

	return (
		<main>
			<div>
				<p>
					Get started by editing&nbsp;
					<code>src/app/files/page.tsx</code>
				</p>
				<div>
					<a
						href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						By <Image src="/vercel.svg" alt="Vercel Logo" width={100} height={24} priority />
					</a>
				</div>
			</div>
			<h1>Welcome! {EGO_CLIENT_ID}</h1>
			<div>
				<a href={`/`}>
					<button onClick={removeToken}>Logout</button>
				</a>
			</div>
		</main>
	);
}
