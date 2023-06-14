import { GoogleLogin } from '@icgc-argo/uikit';
import { getAppConfig } from '@/global/config';

const LoginButton = () => {
	const { EGO_API_ROOT, EGO_CLIENT_ID } = getAppConfig();
	const loginUrl = `${EGO_API_ROOT}/api/oauth/login/google?client_id=${EGO_CLIENT_ID}`;

	return <GoogleLogin link={loginUrl} />;
};

export default LoginButton;
