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

import { ARGOTheme } from '@/app/hooks/ThemeProvider';
import { css } from '@/lib/emotion';
import { Icon, Tooltip } from '@icgc-argo/uikit';
import { ReactNode } from 'react';

const stickyCSS = css`
	background-color: white;
	left: 0;
	position: sticky !important;
	top: 0;
	z-index: 1;
`;

const cellExpandToParent = css`
	height: 28px;
	display: flex;
	align-items: center;
	justify-content: flex-start;
`;

export const styleThickBorder = css`
	border-right: 3px solid ${ARGOTheme.colors.grey};
`;

export const Cell = ({
	children,
	config,
	styles = [],
}: {
	children: ReactNode;
	config: { isLastElement?: boolean; isSorted?: string; isSticky?: boolean };
	styles?: any;
}) => {
	const { isLastElement, isSorted, isSticky } = config;
	const base = css`
		width: 100%;
		padding: 2px 6px;
		font-size: 12px;
		:hover {
			cursor: pointer;
		}
		${isLastElement && styleThickBorder};

		${isSticky && stickyCSS}
		${isSorted && `box-shadow: inset 0 ${isSorted === 'asc' ? '' : '-'}3px 0 0 rgb(7 116 211)`};
		${cellExpandToParent}
		height: 100%;
		min-height: 28px;
	`;

	return <div css={[base, ...styles]}>{children}</div>;
};

export const TopLevelHeader = ({ title, styles = [] }) => {
	const base = css`
		background-color: ${ARGOTheme.colors.grey_4};
		font-size: 13px;
		padding: 5px;
		text-align: left;
		width: 100%;
	`;

	return <div css={[base, ...styles]}>{title}</div>;
};

export const ClinicalCoreCompletionHeader = () => (
	<>
		<TopLevelHeader
			title="CLINICAL CORE COMPLETION"
			styles={[
				styleThickBorder,
				css`
					text-align: center;
				`,
			]}
		/>
		<div
			css={css`
				position: absolute;
				right: 8px;
				top: 50%;
				transform: translateY(-50%);
			`}
		>
			<Tooltip
				html={
					<p
						css={css`
							margin: 0px;
							margin-right: 6px;
						`}
					>
						For clinical completeness, each donor requires: <br />
						DO: at least one Donor record <br />
						PD: at least one Primary Diagnosis record <br />
						NS: all the registered Normal DNA Specimen record <br />
						TS: all the registered Tumour DNA Specimen record <br />
						TR: at least one Treatment record <br />
						FO: at least one Follow Up record <br />
					</p>
				}
			>
				<Icon name="question_circle" fill="primary_2" width="18px" height="18px" />
			</Tooltip>
		</div>
	</>
);
