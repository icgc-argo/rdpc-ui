import { createContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { EGO_JWT_KEY } from '../constants';

type T_AuthContext = {
	egoJwt: string;
};

const AuthContext = createContext<T_AuthContext>({
	egoJwt: '',
});

export const removeToken = () => {
	Cookies.remove(EGO_JWT_KEY);
};

export const logOut = () => {
	removeToken();
};

export default function AuthProvider({
	authData,
	children,
}: {
	authData: T_AuthContext;
	children: ReactNode;
}) {
	return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
}
