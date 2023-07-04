import { EGO_LOGIN_URL } from '@/global/urls';
import { GoogleLogin } from '@icgc-argo/uikit';

const LoginButton = () => {
	return <GoogleLogin link={EGO_LOGIN_URL} />;
};

export default LoginButton;
