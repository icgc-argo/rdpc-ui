import { createContext, PropsWithChildren } from 'react';
import Cookies from 'js-cookie';
import { decodeToken } from '../utils/egoJwt';
import { EGO_JWT_KEY } from '../constants';

export const removeToken = () => {
	Cookies.remove(EGO_JWT_KEY);
};

type T_AuthContext = {
	egoJwt?: string;
	logOut: (path?: string) => void;
	updateToken: () => Promise<string | void>;
	data: ReturnType<typeof decodeToken> | null;
	fetchWithEgoToken: typeof fetch;
	downloadFileWithEgoToken: (input: RequestInfo, init?: RequestInit) => Promise<void>;
	permissions: string[];
	isLoggingOut: boolean;
};

const AuthContext = createContext<T_AuthContext>({
	egoJwt: undefined,
	logOut: () => {},
	updateToken: async () => {},
	data: null,
	fetchWithEgoToken: fetch,
	downloadFileWithEgoToken: async () => {},
	permissions: [],
	isLoggingOut: false,
});

export function AuthProvider({
	egoJwt,
	children,
}: PropsWithChildren<{
	egoJwt?: string;
	initialPermissions: string[];
}>) {
	return <AuthContext.Provider>{children}</AuthContext.Provider>;
}
