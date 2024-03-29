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
import { css } from '@/lib/emotion';
import { Typography } from '@icgc-argo/uikit';
import { FC, ReactNode } from 'react';

type CardProps = {
	title?: string;
	action?: ReactNode;
	fill?: boolean;
	children: ReactNode;
};
const Card: FC<CardProps> = ({ title, action, fill = false, children }) => (
	<div
		css={css`
			${fill &&
			css`
				flex: 1 0 auto;
			`}
			padding: 9px;
		`}
	>
		{(title || action) && (
			<div
				css={css`
					display: flex;
					flex-direction: row;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 2px;
				`}
			>
				<Typography
					css={css`
						margin: 0 0 8px 0;
					`}
					color="primary"
					variant="subtitle2"
					component="h2"
				>
					{title}
				</Typography>
				{action}
			</div>
		)}

		{children}
	</div>
);

export default Card;
