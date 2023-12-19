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

import { Maybe } from '@/__generated__/clinical/graphql';
import { css, useTheme } from '@/lib/emotion';
import { Typography } from '@icgc-argo/uikit';

type DonorStatusProps = { submittedDonors?: Maybe<number>; commitmentDonors?: Maybe<number> };

const DonorStatus = ({ submittedDonors, commitmentDonors }: DonorStatusProps) => {
	const theme = useTheme();
	const numerator = submittedDonors ? submittedDonors : 0;
	const denominator = commitmentDonors ? commitmentDonors : 0;

	return (
		<div
			css={css`
				display: flex;
				flex-wrap: wrap;
			`}
		>
			<Typography
				variant="data"
				component="div"
				css={css`
					margin-right: 15px;
				`}
			>
				{numerator.toLocaleString()}
				<span
					css={css`
						color: ${theme.colors.grey_2};
					`}
				>
					{` / `}
				</span>
				{denominator.toLocaleString()}
			</Typography>
			<Typography variant="data" component="div">
				({((numerator / denominator) * 100).toFixed(2)}%)
			</Typography>
		</div>
	);
};

export default DonorStatus;
