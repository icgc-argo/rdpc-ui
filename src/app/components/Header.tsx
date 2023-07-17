/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
'use client';

import { useState } from 'react';
import {
	AppBar,
	AppBarMenuItem,
	DnaLoader,
	DropdownMenu,
	FocusWrapper,
	Link,
	NavBarElement,
	NavElement,
	UserBadge,
} from '@icgc-argo/uikit';
import { Theme } from '@icgc-argo/uikit/ThemeProvider';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import argoLogo from '/public/argo-logo.svg';
import { css, useTheme } from '@/lib/emotion';
import { useAuthContext } from '@/global/utils/auth';
import LoginButton from './LoginButton';

const ProfileMenu = ({
	isDropdownOpen,
	onProfilePage,
	onClick,
	profileNavDetails,
	theme,
}: {
	isDropdownOpen: boolean;
	onProfilePage: boolean;
	onClick: () => void;
	profileNavDetails: NavElement[];
	theme: Theme;
}) => (
	<FocusWrapper onClick={onClick}>
		{isDropdownOpen && (
			<DropdownMenu>
				{profileNavDetails.map((element, idx) => (
					<NavBarElement key={`profileNavDetail_${idx}`} {...element} isDropdown={true} />
				))}
			</DropdownMenu>
		)}
		<UserBadge
			showGreeting={true}
			firstName={'Test'}
			lastName={'User'}
			title={'DCC Member'}
			className={onProfilePage ? 'active' : ''}
			css={css`
				color: ${onProfilePage ? theme.colors.accent1 : theme.colors.white};
				&:hover {
					color: ${theme.colors.accent1};
				}
			`}
		/>
	</FocusWrapper>
);

const Header = () => {
	const [isDropdownOpen, setDropdownOpen] = useState(false);
	const { egoJwt, authLoading, logOut } = useAuthContext();
	const path = usePathname();
	const theme = useTheme();
	const onProfilePage = path === '/landing-page';
	const profileActive = onProfilePage && !!egoJwt.length && !authLoading;

	const profileNavDetails: Array<NavElement> = [
		{
			active: profileActive,
			href: '/landing-page',
			name: 'Profile & Token',
			LinkComp: Link,
		},
		{
			isLink: false,
			onClick: () => {
				setDropdownOpen(false);
				logOut();
			},
			name: 'Logout',
			active: false,
			href: '',
			LinkComp: Link,
		},
	];

	return (
		<header>
			<AppBar
				css={css`
					border-bottom: none;
				`}
			>
				<div css={css({ height: '30px', width: '208px', position: 'relative' })}>
					<Link href="/">
						<Image alt="ICGC ARGO" src={argoLogo} fill />
					</Link>
				</div>

				{/** keep this div. header will have more items, will be "right-aligned" */}
				<div>
					<AppBarMenuItem
						active={profileActive}
						css={css`
							border-bottom: ${profileActive ? `solid 3px ${theme.colors.accent1}` : ''};
						`}
					>
						{egoJwt ? (
							<ProfileMenu
								isDropdownOpen={isDropdownOpen}
								onProfilePage={onProfilePage}
								onClick={() => {
									setDropdownOpen(!isDropdownOpen);
								}}
								profileNavDetails={profileNavDetails}
								theme={theme}
							/>
						) : authLoading ? (
							<DnaLoader />
						) : (
							<LoginButton />
						)}
					</AppBarMenuItem>
				</div>
			</AppBar>
		</header>
	);
};

export default Header;
