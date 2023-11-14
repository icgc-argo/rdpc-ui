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

/** @jsxImportSource react */
// ^ force default jsx runtime, @emotion/jsx doesn't play nice with server components

import { BUILD_TIME_VARIABLES, EGO_JWT_KEY } from '@/global/constants';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';
import App from './App';

async function getAppConfig() {
	// cache: "no-store" ensures it's run server side
	// url cannot be root - will cause infinite loop
	try {
		const configResp = await fetch(BUILD_TIME_VARIABLES.RUNTIME_CONFIG_URL, {
			cache: 'no-store',
		});
		return await configResp.json();
	} catch (e) {
		if (process.env.NEXT_IS_BUILDING === 'true') {
			console.log(
				"Failed to retrieve server runtime config. Colocated api route won't be available during build.",
			);
		} else {
			console.error(e);
		}
		return {};
	}
}

export default async function RootLayout({ children }: { children: ReactNode }) {
	const appConfig = await getAppConfig();
	const jwt = cookies().get(EGO_JWT_KEY)?.toString();
	return (
		<html lang="en">
			<body>
				<App config={appConfig} jwt={jwt}>
					{children}
				</App>
			</body>
		</html>
	);
}
