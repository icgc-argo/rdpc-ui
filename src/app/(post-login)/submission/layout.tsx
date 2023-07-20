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
import { Icon } from '@icgc-argo/uikit';
import { ReactNode, useState } from 'react';
import SideMenu from './components/SideMenu';
import TitleBar from './components/TitleBar';
import TEMP_DATA from './data.temp';

const SideMenuToggle = ({ onToggle }: { onToggle: any }) => (
	<div
		css={css`
			width: 20px;
			display: flex;
		`}
		onClick={onToggle}
	>
		<Icon name="chevron_right" />
		<Icon
			name="chevron_right"
			css={css`
				position: relative;
				left: -3px;
			`}
		/>
	</div>
);

export default function AppLayout({ children }: { children: ReactNode }) {
	const theme = useTheme();
	const programData = TEMP_DATA;
	const [isSidebarActive, setSidebarActive] = useState<boolean>(true);

	return (
		<div
			css={css`
				display: grid;
				grid-template-columns: ${isSidebarActive ? '248px' : '40px'} 1fr;
			`}
		>
			<div>
				<SideMenu programs={programData} isActive={isSidebarActive} />
				<SideMenuToggle onToggle={() => setSidebarActive((t) => !t)} />
			</div>
			<div>
				<TitleBar />
				<div
					id="content"
					css={css`
						background: ${theme.colors.grey_4};
						padding: 40px;
						height: 100%;

						> div {
							background: white;
							border-radius: 8px;
						}
					`}
				>
					{children}
				</div>
			</div>
		</div>
	);
}
