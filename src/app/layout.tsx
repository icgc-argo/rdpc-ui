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

import { ReactNode } from 'react';
import App from './App';

async function getAppConfig() {
	// cache: "no-store" ensures it's run server side
	// fetch isn't actually doing anything except forcing server side render
	// it's a "blocking" data call
	// this is a server component so we have full access to process and can get vars from ehre
	// url cannot be root - will cause infinite loop
	try {
		// TODO: this as env var
		await fetch('http://localhost:3000/api', { cache: 'no-store' });
		console.log('getconfig', process.env.TEST_RUNTIME_VAR);
		return process.env.TEST_RUNTIME_VAR;
	} catch (e) {
		console.log('this is likely happening during "next build". catch it so it doesnt exit build');
		console.error(e);
	}
}

export default async function RootLayout({ children }: { children: ReactNode }) {
	const appConfig = getAppConfig();
	console.log('app config layout', appConfig);
	return (
		<html lang="en">
			<body>
				<App config={appConfig}>{children}</App>
			</body>
		</html>
	);
}
