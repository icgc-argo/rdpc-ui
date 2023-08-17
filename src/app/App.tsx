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
// all our context providers won't work server side, beacuse React.Context is client side
'use client';

import { AuthProvider } from '@/global/utils/auth';
import { css } from '@/lib/emotion';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AppConfigProvider } from './components/ConfigProvider';
import Footer from './components/Footer';
import Header from './components/Header';
import ThemeProvider from './components/ThemeProvider';

const queryClient = new QueryClient();

// Apollo
const link = createHttpLink({
	uri: 'https://argo-gateway.dev.argo.cancercollaboratory.org/graphql',
	credentials: 'include',
});

const apolloClient = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});

const App = ({ children, config }: { children: ReactNode; config: any }) => (
	<ThemeProvider>
		<QueryClientProvider client={queryClient}>
			<AppConfigProvider config={config}>
				<AuthProvider>
					<ApolloProvider client={apolloClient}>
						<div
							css={css`
								display: grid;
								grid-template-rows: 58px 1fr 59px; /* header + content + footer*/
								min-height: 100vh;
							`}
						>
							<Header />
							{children}
							<Footer />
						</div>
					</ApolloProvider>
				</AuthProvider>
			</AppConfigProvider>
		</QueryClientProvider>
	</ThemeProvider>
);

export default App;
