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

import { useAuthContext } from '@/global/utils/auth';
import { css, useTheme } from '@/lib/emotion';
import { AppBarMenuItem, DnaLoader, Link, NavElement } from '@icgc-argo/uikit';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import LoginButton from './LoginButton';
import ProfileMenu from './ProfileMenu';
import argoLogo from '/public/argo-logo.svg';

export const HEADER_HEIGHT_PX = '58';

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
		<header
			css={css`
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;
				height: ${HEADER_HEIGHT_PX}px;
				background-color: ${theme.colors.primary};
				border-bottom: none;
				position: sticky;
				top: 0px;
				z-index: 2;
			`}
		>
			<div
				css={css`
					margin-left: 18px;
					height: 30px;
					width: 208px;
					position: relative;
				`}
			>
				<Link href="/">
					<Image alt="ICGC ARGO" src={argoLogo} fill />
				</Link>
			</div>

			{/** "right-aligned" **/}
			<div
				css={css`
					display: flex;
					height: 100%;
					flex-direction: row;
					& > div {
						border-left: 1px solid ${theme.colors.grey};
					}
				`}
			>
				{authLoading ? (
					<DnaLoader />
				) : !egoJwt ? (
					<LoginButton />
				) : (
					<AppBarMenuItem
						active={profileActive}
						css={css`
							border-bottom: ${profileActive ? `solid 3px ${theme.colors.accent1}` : ''};
						`}
					>
						<ProfileMenu
							isDropdownOpen={isDropdownOpen}
							onProfilePage={onProfilePage}
							onClick={() => {
								setDropdownOpen(!isDropdownOpen);
							}}
							profileNavDetails={profileNavDetails}
							theme={theme}
						/>
					</AppBarMenuItem>
				)}
			</div>
		</header>
	);
};

export default Header;
