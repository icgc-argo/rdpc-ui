/*
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
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

import { exportToTsv } from '@/global/utils';
import {
	Button,
	Icon,
	NOTIFICATION_VARIANTS,
	Notification,
	NotificationVariant,
	css,
} from '@icgc-argo/uikit';
import union from 'lodash/union';
import { ComponentProps, ReactNode, createRef } from 'react';

export type ErrorReportColumns = any;
const ErrorNotification = <T extends { [k: string]: any }>({
	level,
	onClearClick,
	reportColumns = [],
	reportData = [],
	subtitle,
	tableComponent = <></>,
	title,
	tsvExcludeCols = [],
	tableProps,
}: {
	level: NotificationVariant;
	onClearClick?: ComponentProps<typeof Button>['onClick'];
	reportColumns: ErrorReportColumns[];
	reportData: Array<T>;
	subtitle: ReactNode;
	tableComponent?: JSX.Element;
	title: string;
	tsvExcludeCols?: Array<keyof T>;
	tableProps?: any;
}) => {
	const onDownloadClick = () => {
		exportToTsv(reportData, {
			exclude: union(tsvExcludeCols, ['__typename']),
			order: reportColumns.map((entry) => entry.id),
			fileName: `${level}_report.tsv`,
			headerDisplays: reportColumns.reduce(
				(acc, { Header, id }) => ({
					...acc,
					[id]: Header,
				}),
				{},
			),
		});
	};

	return (
		<Notification
			variant={level}
			interactionType="NONE"
			title={
				<div
					css={css`
						display: flex;
						justify-content: space-between;
					`}
				>
					{title}
					<div
						css={css`
							display: flex;
						`}
					>
						<Button variant="secondary" size="sm" onClick={onDownloadClick}>
							<span
								css={css`
									display: flex;
									align-items: center;
								`}
							>
								<Icon
									name="download"
									fill="accent2_dark"
									height="12px"
									css={css`
										margin-right: 5px;
									`}
								/>
								{level === NOTIFICATION_VARIANTS.ERROR ? `Error` : `Warning`} Report
							</span>
						</Button>
						{!!onClearClick && (
							<Button
								isAsync
								id="button-clear-selected-file-upload"
								variant="text"
								size="sm"
								onClick={onClearClick}
							>
								Clear
							</Button>
						)}
					</div>
				</div>
			}
			contentProps={{
				css: css`
					overflow: hidden;
				`,
			}}
			content={(() => {
				const containerRef = createRef<HTMLDivElement>();
				return (
					<div
						ref={containerRef}
						css={css`
							margin-top: 10px;
							width: 100%;
						`}
					>
						<div>{subtitle}</div>
						{tableComponent}
					</div>
				);
			})()}
		/>
	);
};

export default ErrorNotification;
