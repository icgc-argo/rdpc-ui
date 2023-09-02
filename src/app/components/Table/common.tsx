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

import { displayDateAndTime, formatFileName } from '@/global/utils/clinical';
import { css, styled, useTheme } from '@/lib/emotion';
import { Icon, Outline, ThemeColorNames, Typography } from '@icgc-argo/uikit';
import { ComponentType, HtmlHTMLAttributes, ReactNode } from 'react';
import { Col, Row } from 'react-grid-system';

export const CellContentCenter = styled('div')`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const DataTableStarIcon = (props: { fill: keyof ThemeColorNames; outline?: Outline }) => (
	<Icon name="star" width="16px" height="16px" {...props} />
);

export const StatArea: {
	Container: ComponentType<{ className?: string; children?: ReactNode }>;
	Section: ComponentType<
		HtmlHTMLAttributes<HTMLDivElement> & { faded?: boolean; children?: ReactNode }
	>;
	StatEntryContainer: ComponentType<HtmlHTMLAttributes<HTMLDivElement>>;
	StarIcon: typeof DataTableStarIcon;
} = (() => {
	const Container: ComponentType<{ className?: string; children: ReactNode }> = ({
		children,
		className,
	}) => (
		<Typography
			variant="data"
			component="div"
			color="grey"
			className={className}
			css={css`
				display: flex;
				align-items: center;
				margin-right: 50px;
			`}
		>
			{children}
		</Typography>
	);

	const Section = styled('div')<{ faded?: boolean }>`
		display: flex;
		align-items: center;
		margin-right: 16px;
		text-align: center;
		opacity: ${({ faded }) => (faded ? 0.3 : 1)};
	`;

	const StatEntryContainer = styled('div')`
		margin-right: 5px;
		display: flex;
		align-items: center;
	`;

	const StarIcon: typeof DataTableStarIcon = (props) => (
		<div
			css={css`
				margin-right: 5px;
				display: flex;
			`}
		>
			<DataTableStarIcon {...props} />
		</div>
	);

	return {
		Container,
		Section,
		StatEntryContainer,
		StarIcon,
	};
})();

export const SubmissionInfoArea = ({
	fileName,
	createdAt,
	creator,
}: {
	fileName: string;
	creator: string;
	createdAt: string;
}) => (
	<Typography
		variant="data"
		component="div"
		css={css`
			text-align: right;
		`}
	>
		<Typography
			variant="data"
			css={css`
				font-weight: 600;
			`}
		>
			{formatFileName(fileName)}{' '}
		</Typography>
		uploaded on{' '}
		<Typography
			variant="data"
			css={css`
				font-weight: 600;
			`}
		>
			{displayDateAndTime(createdAt)}{' '}
		</Typography>
		by{' '}
		<Typography
			variant="data"
			css={css`
				font-weight: 600;
			`}
		>
			{creator}
		</Typography>
	</Typography>
);

export const TableInfoHeaderContainer = ({
	left,
	right,
	noMargin,
}: {
	left?: ReactNode;
	right?: ReactNode;
	noMargin?: boolean;
}) => {
	const theme = useTheme();
	return (
		<div
			css={css`
				margin-bottom: ${noMargin ? '0px' : '3px'};
				border-radius: 2px;
				background-color: ${theme.colors.grey_3};
				padding: 8px;
			`}
		>
			<Row nogutter>
				{left}
				<Col>{right}</Col>
			</Row>
		</div>
	);
};