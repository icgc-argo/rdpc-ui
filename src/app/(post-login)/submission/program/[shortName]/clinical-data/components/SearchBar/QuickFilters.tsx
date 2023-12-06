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

import { css, useTheme } from '@/lib/emotion';
import { Button, DropdownButton, Icon, Input, Typography } from '@icgc-argo/uikit';
import { useRef, useState } from 'react';
import SearchResultsMenu from './ResultsMenu';
import { COMPLETION_OPTIONS, SearchBarProps } from './SearchBar';
import {
	searchBarParentStyle,
	searchDownArrowStyle,
	searchDropdownStyle,
	searchFilterButtonStyle,
	searchFilterContainerStyle,
	searchFilterIconStyle,
	searchFilterParentStyle,
	searchInputFieldStyle,
} from './style';

type QuickFilterProps = Pick<SearchBarProps, 'completionStatus' | 'keyword'> & {
	donors: [];
	searchResults: [];
	onInputChange: Function;
	onClickList: Function;
	onSelectResult: Function;
};
const QuickFilters = ({
	donors,
	completionStatus,
	keyword,
	searchResults,
	onClickList,
	onInputChange,
	onSelectResult,
}: QuickFilterProps) => {
	const theme = useTheme();
	const [searchOpen, setSearchOpen] = useState(false);
	const menuItemDropdownRef = useRef(null);

	const MENU_ITEMS = Object.values(COMPLETION_OPTIONS);

	const searchResultMenuItems =
		searchResults
			.map((result) => {
				const { donorId, submitterDonorId } = result;
				return donorId ? { resultId: `DO${donorId}`, secondaryText: submitterDonorId } : null;
			})
			.filter((result) => !!result)
			.slice(0, 20) || [];

	return (
		<div>
			<div css={searchFilterParentStyle}>
				<Typography variant="label">Quick Filters:</Typography>
				<DropdownButton
					css={searchDropdownStyle}
					disabled={!!donors.length}
					value={completionStatus.value}
					variant="secondary"
					size="sm"
					onItemClick={(e) => completionStatus.setter(e.value)}
					menuItems={MENU_ITEMS}
				>
					{`Show ${COMPLETION_OPTIONS[completionStatus.value].display}`}
					<Icon name="chevron_down" fill="accent2_dark" css={searchDownArrowStyle} />
				</DropdownButton>
			</div>

			<div css={searchBarParentStyle}>
				<Input
					aria-label="search-for-files"
					getOverrideCss={() => searchInputFieldStyle}
					onKeyDown={(e) => {
						if (e.key === 'Enter') setSearchOpen(false);
					}}
					onChange={(e) => {
						if (e.target.value.length === 0) {
							//setFilterValue('');
							onInputChange();
						} else {
							keyword.setter(e.target.value);
							setSearchOpen(true);
						}
					}}
					placeholder="Donor ID/Submitter Donor ID"
					preset="search"
					showClear
					size="sm"
					value={keyword.value}
				/>
				{keyword.value && keyword.value.length >= 1 && searchOpen ? (
					<>
						<div
							css={css`
								background: transparent;
								border-right: 1px solid ${theme.colors.primary_4};
								border-left: 1px solid ${theme.colors.primary_4};
								height: 18px;
								width: 248px;
								z-index: 0;
								position: absolute;
								top: 28px;
							`}
							ref={menuItemDropdownRef}
						/>
						<SearchResultsMenu
							searchData={searchResultMenuItems}
							isLoading={false}
							onSelect={() => onSelectResult()}
						/>
					</>
				) : null}
				<Button css={searchFilterButtonStyle} variant="secondary" onClick={() => onClickList()}>
					<span css={searchFilterContainerStyle}>
						<Icon name="filter" fill="accent2_dark" height="12px" css={searchFilterIconStyle} />
						List
					</span>
				</Button>
			</div>
		</div>
	);
};

export default QuickFilters;
