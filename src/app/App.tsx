import { AuthProvider } from '@/global/utils/auth';
import { ThemeProvider, css } from '@/lib/emotion';
import { Footer } from '@icgc-argo/uikit';
import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import Header from './components/Header';

const queryClient = new QueryClient();

const App = ({ children }: { children: ReactNode }) => (
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
