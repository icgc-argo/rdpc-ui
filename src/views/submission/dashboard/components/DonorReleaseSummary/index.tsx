/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import DASHBOARD_SUMMARY_QUERY from '@/gql/gateway/DASHBOARD_SUMMARY_QUERY';
import { useGatewayQuery } from '@/hooks';
import { css, Typography } from '@icgc-argo/uikit';
import { DashboardCard } from '../common';

const DonorReleaseSummary = ({ programShortName }) => {
	const { data, loading } = useGatewayQuery(DASHBOARD_SUMMARY_QUERY, {
		variables: { programShortName },
	});

	return (
		<DashboardCard>
			<Typography variant="default" component="span">
				Donor Release Summary
			</Typography>

			<div
				css={css`
					margin-top: 40px;
					background-color: #dcdde1;
					border-radius: 8px;
					width: 100%;
					margin-bottom: 8px;
				`}
			>
				&nbsp;
			</div>

			<div
				css={css`
					display: flex;
					align-items: flex-end;
					flex-direction: row;
					justify-content: space-between;
				`}
			>
				<Typography variant="caption" color="grey">
					With Released Files
				</Typography>

				<div>
					<Typography
						variant="caption"
						bold={true}
						css={css`
							margin-right: 5px;
						`}
					>
						{loading ? '...' : data.program.commitmentDonors.toLocaleString()}
					</Typography>
					<Typography variant="caption" color="grey">
						Committed
					</Typography>
				</div>
			</div>
		</DashboardCard>
	);
};

export default DonorReleaseSummary;
