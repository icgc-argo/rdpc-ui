import { createContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { EGO_JWT_KEY } from '../constants';

export const removeToken = () => {
	Cookies.remove(EGO_JWT_KEY);
};

type T_AuthContext = {
	egoJwt?: string;
};

const AuthContext = createContext<T_AuthContext>({
	egoJwt: '',
});

export function AuthProvider(children: ReactNode) {
	const authData = {};

	return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
}
