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

import { css, useTheme } from '@/lib/emotion';
import { Interpolation, Theme } from '@emotion/react';
import { Icon, MenuItem, SubMenu, UikitIconNames } from '@icgc-argo/uikit';
import { useState } from 'react';
import ProgramMenu from './ProgramMenu';
import Search from './Search';

const SideMenuContent = ({ content }: { content: any[] }) => {
	const [programNameSearch, setProgramNameSearch] = useState('');

	return (
		<SubMenu>
			<MenuItem icon={<Icon name="programs" />} content={'My Programs'} selected>
				<Search query={programNameSearch} onChange={setProgramNameSearch} />
				<ProgramMenu programs={content.slice(0, -1)} searchQuery={programNameSearch} />
			</MenuItem>
		</SubMenu>
	);
};

const ToggleChevron = ({ css, name }: { css?: Interpolation<Theme>; name: UikitIconNames }) => (
	<Icon height="10px" fill="primary_2" css={css} name={name} />
);

const SideMenuToggle = ({ onToggle, open }: { onToggle: () => void; open: boolean }) => (
	<div
		css={css`
			height: 56px;
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

type SideMenuProps = { content: any; onToggle: () => void; isActive: boolean };
const SideMenu = ({ content, onToggle, isActive }: SideMenuProps) => {
	const theme = useTheme();

	return (
		<div
			css={css`
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				background-color: ${theme.colors.white};
			`}
		>
			<div
				css={css`
					height: calc(100vh - 52px);
					overflow-y: auto;
					visibility: ${isActive ? 'visible' : 'hidden'};
				`}
			>
				<SideMenuContent content={content} />
			</div>
			<SideMenuToggle onToggle={onToggle} open={isActive} />
		</div>
	);
};

export default SideMenu;
