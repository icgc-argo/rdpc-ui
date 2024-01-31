import { Interpolation, Theme, css } from '@emotion/react';
import { Icon, UikitIconNames } from '@icgc-argo/uikit';

const ToggleChevron = ({ css, name }: { css?: Interpolation<Theme>; name: UikitIconNames }) => (
	<Icon height="10px" fill="primary_2" css={css} name={name} />
);

export const TOGGLE_HEIGHT_PX = 56;
const SideMenuToggle = ({ onToggle, open }: { onToggle: () => void; open: boolean }) => (
	<div
		css={css`
			height: ${TOGGLE_HEIGHT_PX}px;
			width: 100%;
			display: flex;
			justify-content: flex-end;
			padding-right: ${open ? '22px' : '12px'};

			&:hover {
				cursor: pointer;
			}
		`}
		onClick={onToggle}
	>
		<div
			css={css`
				display: ${open ? 'block' : 'none'};
			`}
		>
			<ToggleChevron name="chevron_left" />
			<ToggleChevron
				name="chevron_left"
				css={css`
					position: relative;
					left: -3px;
				`}
			/>
		</div>
		<div
			css={css`
				display: ${!open ? 'block' : 'none'};
			`}
		>
			<ToggleChevron name="chevron_right" />
			<ToggleChevron
				name="chevron_right"
				css={css`
					position: relative;
					left: -3px;
				`}
			/>
		</div>
	</div>
);

export default SideMenuToggle;
