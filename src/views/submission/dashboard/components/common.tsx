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

import { css } from '@/lib/emotion';
import { Container } from '@icgc-argo/uikit';
import { ComponentType } from 'react';

export const DashboardCard: ComponentType<{
	cardHeight?: string;
	loading?: boolean;
	children: React.ReactNode;
}> = ({ children, cardHeight = '100%', loading = false }) => (
	<Container
		loading={loading}
		css={css`
			height: ${cardHeight};
		`}
	>
		<div
			css={css`
				padding: 16px;
			`}
		>
			{children}
		</div>
	</Container>
);

type ProgramDonorSummaryStats = {
	registeredDonorsCount: number;
	percentageCoreClinical: number;
	percentageTumourAndNormal: number;
	donorsProcessingMolecularDataCount: number;
	filesToQcCount: number;
	donorsWithReleasedFilesCount: number;
	allFilesCount: number;
	fullyReleasedDonorsCount: number;
	partiallyReleasedDonorsCount: number;
	noReleaseDonorsCount: number;
};

type Program = {
	commitmentDonors: number;
};

export type DashboardSummaryData = {
	programDonorSummary: {
		stats: ProgramDonorSummaryStats;
	};
	program: Program;
};

export type DashboardSummaryDataVariables = {
	programShortName: string;
};

export const POLL_INTERVAL_MILLISECONDS: number = 3000;