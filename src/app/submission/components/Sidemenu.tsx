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
import { Icon, MenuItem, SubMenu } from '@icgc-argo/uikit';
import { useState } from 'react';
import ProgramMenu from './ProgramMenu';
import Search from './Search';

/**
 *
 * derive state don't hardcode
 * take programs and active whatever
 * network requests level above
 */

export default function SideMenu({ programs }: { programs: any[] }) {
	const theme = useTheme();
	const [programNameSearch, setProgramNameSearch] = useState('');

	return (
		<div
			css={css`
				z-index: 1;
				background: ${theme.colors.white};
				box-shadow: ${theme.shadows.pageElement};
				display: flex;
				flex-direction: column;
				justify-content: space-between;
			`}
		>
			{JSON.stringify(programNameSearch)}
			<Search query={programNameSearch} onChange={setProgramNameSearch} />
			<ProgramMenu
				programs={[{ shortName: 'CIA-IE' }, { shortName: 'BAZ-IE' }]}
				searchQuery={programNameSearch}
			/>
			<SubMenu>
				<MenuItem icon={<Icon name="programs" />} content={'My Programs'} selected noChevron>
					<div>SearchBar</div>
					<MenuItem key={'ley'} content={'shortname'} selected noChevron>
						MenuItem{' '}
					</MenuItem>
				</MenuItem>
			</SubMenu>
		</div>
	);
}
