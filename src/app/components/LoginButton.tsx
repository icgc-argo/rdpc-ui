import { Button, Icon } from '@icgc-argo/uikit';
import { getAppConfig } from '@/global/config';
import { css } from '@/lib/emotion';

const LoginButton = () => {
	const { EGO_API_ROOT, EGO_CLIENT_ID } = getAppConfig();
	const loginUrl = `${EGO_API_ROOT}/api/oauth/login/google?client_id=${EGO_CLIENT_ID}`;

	return (
		<a
			href={loginUrl}
			css={css`
				align-self: center;
				text-decoration: none;
				padding: 0 16px;
			`}
		>
			<Button>
				<span
					css={css`
						display: flex;
						justify-content: center;
						align-items: center;
					`}
				>
					<Icon
						name="google"
						css={css`
							margin-right: 5px;
						`}
					/>
					Login
				</span>
			</Button>
		</a>
	);
};

export default LoginButton;
