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

import { css, Typography, Button, Icon } from '@icgc-argo/uikit';
import Link from 'next/link';

const heroCss = (theme: any) =>
	css({
		backgroundImage: `linear-gradient(to bottom, 
      ${theme.colors.primary}, 
      ${theme.colors.accent2}00 105%),
      url('/images/icgc-galaxy-bg.jpg')`,
		backgroundPosition: 'center',
		backgroundSize: 'cover',
		backgroundColor: `${theme.colors.primary}`,
		width: '100%',
	});

const HeroDiv = styled('div')`
	// TODO: MAKE ME CSS!
	background-image: ${({ theme }) =>
		`linear-gradient(to bottom, 
      ${theme.colors.primary}, 
      ${theme.colors.accent2}00 105%),
      url('/images/icgc-galaxy-bg.jpg');`};

	background-position: center;
	background-size: cover;
	background-color: ${({ theme }) => theme.colors.primary};
	width: 100%;
`;

export default function Hero() {
	return (
		<HeroDiv>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: space-evenly;
					padding-bottom: ${true ? '40px' : '0px'};
				`}
			>
				<Typography
					variant="hero"
					color="white"
					bold={true}
					css={css`
						margin: 30px 50px 10px;
						text-align: center;
					`}
					as="h1"
				>
					ICGC ARGO Data Platform
				</Typography>
				<Typography
					as="p"
					variant="title"
					color="white"
					css={css`
						margin: 0 50px;
						font-size: 15px;
						line-height: 24px;
						text-align: center;
						width: 60%;
					`}
				>
					The International Cancer Genome Consortium Accelerating Research in Genomic Oncology (ICGC
					ARGO) aims to{' '}
					<b>uniformly analyze specimens from 100,000 donors with high quality clinical data </b>
					in order to address outstanding questions that are vital to the quest to defeat cancer.
				</Typography>
				<div
					css={css`
						display: flex;
						flex-direction: row;
						justify-content: space-between;
						margin-top: 20px;
					`}
				>
					<NextLink href={FILE_REPOSITORY_PATH}>
						<Link
							underline={false}
							css={css`
								margin: 0 15px;
							`}
						>
							<Button variant="secondary">
								<Icon
									css={css`
										padding-right: 2px;
									`}
									name="file"
									fill="accent2"
									height="12px"
								/>
								Browse the Data
							</Button>
						</Link>
					</NextLink>

					<Link
						href="https://www.icgc-argo.org/"
						underline={false}
						css={css`
							margin: 0 15px;
						`}
						target="_blank"
					>
						<Button variant="secondary">
							<Icon
								css={css`
									padding-right: 2px;
								`}
								name="programs"
								fill="accent2"
								height="12px"
							/>
							About ICGC ARGO
						</Button>
					</Link>
				</div>
			</div>
		</HeroDiv>
	);
}
