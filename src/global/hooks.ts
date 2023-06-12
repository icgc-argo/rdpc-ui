import Cookies from 'js-cookie';
import { EGO_JWT_KEY } from './constants';

export const removeToken = () => {
	Cookies.remove(EGO_JWT_KEY);
};
