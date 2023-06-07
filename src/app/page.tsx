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

import Button from '@/components/Button';
import Typography from '@/components/Typography';
import Icon from '@/components/Icon';

import { useTheme, css } from '@emotion/react';
import styled from '@emotion/styled';

// const Hero = styled('div')`
// 	background-image: ${({ theme }) =>
// 		`linear-gradient(to bottom,
//       ${theme.colors.primary},
//       ${theme.colors.accent2}00 105%),
//       url('/assets/icgc-galaxy-bg.jpg');`};
// 	background-position: center;
// 	background-size: cover;
// 	background-color: ${({ theme }) => {
// 		console.log('ts', theme);
// 		return theme.colors.primary;
// 	}};
// 	width: 100%;
// `;

const Test = styled('div')`
	background-color: ${({ theme }) => {
		console.log('ts', theme);
		return theme.colors.primary;
	}};
`;

const style = css({
	color: 'blue',
	fontFaamily: '-moz-initial',
});

export default function Home() {
	const theme = useTheme();
	const x = theme.colors.accent1;
	console.log('color', x);

	return (
		<>
			<main>
				<div
					css={() =>
						css({
							color: 'blue',
							fontFamily: '-moz-initial',
						})
					}
				>
					zz
				</div>
				<div
					css={(theme) => {
						console.log('css theem', theme);
						return '';
					}}
				></div>
				<Test />
				{/* <div>
					<DataCallout
						iconName={'dna_locked'}
						iconFill={'secondary'}
						circleFill={'secondary_3'}
						title={'Access Controlled Data'}
						urlData={{
							text: 'How to apply',
							href: '',
						}}
					>
						The <b>Data Access Compliance Office (DACO)</b> handles approval for access to
						controlled molecular data in the ARGO Data Platform.
					</DataCallout>

					<DataCallout
						iconName={'download'}
						iconFill={'accent4_dark'}
						circleFill={'accent4_3'}
						title="Data Submission Guide"
						urlData={{
							text: 'Data Submission Guide',
							href: '',
						}}
					>
						Instructions for programs to submit clinical and molecular data.
					</DataCallout>

					<DataCallout
						iconName={'workflow'}
						iconFill={'accent2_dark'}
						circleFill={'accent2_3'}
						title={'Data Analysis Workflows'}
						urlData={{
							text: 'About our Workflows',
							href: '',
						}}
					>
						ARGO RPDC uniformly analyzes molecular data against the{' '}
						<b>GRCh38 Human Reference Genome.</b>
					</DataCallout>
				</div> */}
			</main>
		</>
	);
}
