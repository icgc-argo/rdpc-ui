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
import { DataCallout, Link, Typography, overtureLogo } from '@icgc-argo/uikit';
import Image from 'next/image';
import { ComponentType } from 'react';

const OvertureBanner: ComponentType = () => {
	const theme = useTheme();
	return (
		<div
			css={css`
				padding: 10px 12%;
				display: flex;
				text-align: center;
				justify-content: center;
				align-items: center;
				border-top: 1px solid ${theme.colors.grey_2};
				background-color: ${theme.colors.grey_4};
			`}
		>
			<Link
				href="https://www.overture.bio/"
				target="_blank"
				css={css`
					padding-top: 4px;
				`}
			>
				<Image alt="Logo for Ontario Institute for Cancer Research" src={overtureLogo} />
			</Link>
			<Typography
				color={theme.colors.grey}
				variant="data"
				css={css`
					margin-left: 20px;
				`}
			>
				The ARGO Data Platform is built with open-source products that you can incorporate into your
				systems though{' '}
				<Link href="https://www.overture.bio/" target="_blank">
					Overture.bio
				</Link>
				.
			</Typography>
		</div>
	);
};

const ActionBox: ComponentType = () => (
	<div css={css({ container: 'callouts / inline-size' })}>
		<div
			css={css`
				display: grid;
				grid-template-columns: repeat(3, 1fr);
				margin: 60px 0 40px 0;

				> div:not(:last-child) {
					border-right: 1px solid #dcdde1;
				}

				/* breakpoint where buttons will soft wrap and look worse with icon on second line */
				@container callouts (width < 840px) {
					grid-template-columns: 1fr;
					row-gap: 20px;
					padding: 0 5%;

					> div:not(:last-child) {
						border-right: none;
						border-bottom: 1px solid #dcdde1;
					}
				}
			`}
		>
			<DataCallout
				iconName="dna_locked"
				iconFill="secondary"
				circleFill="secondary_3"
				title="Access Controlled Data"
				urlData={{
					text: 'How to apply',
					href: '',
				}}
			>
				The <b>Data Access Compliance Office (DACO)</b> handles approval for access to controlled
				molecular data in the ARGO Data Platform.
			</DataCallout>

			<DataCallout
				iconName="download"
				iconFill="accent4_dark"
				circleFill="accent4_3"
				title="Data Submission Guide"
				urlData={{
					text: 'Data Submission Guide',
					href: '',
				}}
			>
				Instructions for programs to submit clinical and molecular data.
			</DataCallout>

			<DataCallout
				iconName="workflow"
				iconFill="accent2_dark"
				circleFill="accent2_3"
				title="Data Analysis Workflows"
				urlData={{
					text: 'About our Workflows',
					href: '',
				}}
			>
				ARGO RPDC uniformly analyzes molecular data against the{' '}
				<b>GRCh38 Human Reference Genome.</b>
			</DataCallout>
		</div>
	</div>
);

export default function Home() {
	return (
		<main>
			<ActionBox />
			<OvertureBanner />
		</main>
	);
}
