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

/**
 * React.Context, used by ThemeProvider, doesn't work server side so we're defaulting to client side rendering
 */
'use client';

import { ReactNode, useState } from 'react';
import { Work_Sans } from 'next/font/google';
import AuthProvider from '@/global/auth';
import Header from './components/Header';
import ThemeProvider from './components/ThemeProvider';

const workSans = Work_Sans({ subsets: ['latin'] });

export default function RootLayout({ children }: { children: ReactNode }) {
	const [egoJwt, setEgoJwt] = useState('');

	return (
		<html lang="en">
			<body className={workSans.className}>
				<AuthProvider authData={{ egoJwt }}>
					<ThemeProvider>
						<Header />
						{children}
					</ThemeProvider>
				</AuthProvider>
			</body>
		</html>
	);
}
