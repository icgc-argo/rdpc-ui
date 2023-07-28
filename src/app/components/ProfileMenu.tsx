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

import { css } from '@/lib/emotion';
import { DropdownMenu, FocusWrapper, NavBarElement, NavElement, UserBadge } from '@icgc-argo/uikit';
import { Theme } from '@icgc-argo/uikit/ThemeProvider';

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

export default ProfileMenu;
