/**
 * React.Context, used by ThemeProvider, doesn't work server side so we're defaulting to client side rendering
 */
'use client';

import { AuthProvider } from '@/global/utils/auth';
import { css } from '@/lib/emotion';
import { Footer } from '@icgc-argo/uikit';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Header from './components/Header';
import ThemeProvider from './components/ThemeProvider';

const queryClient = new QueryClient();

const App = ({ children, config }: { children: ReactNode; config: any }) => (
	<ThemeProvider>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
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
			</AuthProvider>
		</QueryClientProvider>
	</ThemeProvider>
);

export default App;
