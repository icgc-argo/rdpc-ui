import { css, useTheme } from '@/lib/emotion';
import { TitleBar, Link as UIKitLink } from '@icgc-argo/uikit';
import Link from 'next/link';
import { FunctionComponent } from 'react';
import { Row } from 'react-grid-system';
import ProgressBar, { ProgressState } from './ProgressBar';

type ContentHeaderProps = {
	breadcrumb: string[];
	progress: ProgressState;
	helpUrl: string;
};

const ContentHeader: FunctionComponent<ContentHeaderProps> = ({
	breadcrumb,
	progress,
	helpUrl,
}) => {
	const theme = useTheme();
	return (
		<div
			css={css`
				display: flex;
				height: 56px;
				padding: 0 30px;
				align-items: center;
				background-color: ${theme.colors.white};
			`}
		>
			<TitleBar>
				<>{breadcrumb[0]}</>
				<Row nogutter align="center">
					<div
						css={css`
							margin-right: 20px;
						`}
					>
						{breadcrumb[1]}
					</div>
					{status && <div>status bar</div>}
				</Row>
			</TitleBar>
			{progress && <ProgressBar progressState={progress} />}
			<div
				css={css`
					margin-left: auto;
				`}
			>
				<Link href={helpUrl} legacyBehavior>
					<UIKitLink
						target="_blank"
						css={css`
							font-size: 14px;
						`}
						withChevron
						href={helpUrl}
						underline={false}
						bold
					>
						HELP
					</UIKitLink>
				</Link>
			</div>
		</div>
	);
};

export default ContentHeader;
