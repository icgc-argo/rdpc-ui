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

import { Typography, css, useTheme } from '@icgc-argo/uikit';
import LoginButton from './LoginButton';
import galaxyImage from '../../../public/assets/galaxy.png';
import RegionBanner from './RegionBanner';
import Link from 'next/link';

const BackLink = (
	<div
		css={css`
			padding: 17px 0 0 17px;
			* {
				line-height: 28px;
				color: white;
				font-size: 12px;
				font-weight: 600;
			}
		`}
	>
		<span>{`< `}</span>
		<Link
			href="#"
			css={css({
				textDecoration: 'underline',
			})}
		>{`Back to ICGC ARGO`}</Link>
	</div>
);

const Hero = () => {
	const theme = useTheme();
	return (
		<div
			css={css({
				backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 41.37%, #000000 100%), url(${galaxyImage.src})`,
				backgroundSize: 'cover',
				backgroundColor: `${theme.colors.primary}`,
				width: '100%',
			})}
		>
			{BackLink}
			<div
				css={css({
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'space-evenly',
					padding: '20px 15px 76px 15px',
					margin: '0 auto',
					maxWidth: '860px',
				})}
			>
				<RegionBanner region="Germany" />

				<Typography
					variant="hero"
					color="white"
					bold={true}
					css={css({
						margin: '18px 50px 35px',
						textAlign: 'center',
					})}
					as="h1"
				>
					RPDC Clinical Data Submission Portal{' '}
				</Typography>

				<Typography
					as="p"
					variant="sectionHeader"
					color="white"
					css={css({
						marginBottom: '62px',
						lineHeight: '24px',
					})}
				>
					The International Cancer Genome Consortium Accelerating Research in Genomic Oncology (ICGC
					ARGO) aims to uniformly analyze specimens from 100,000 donors with high quality clinical
					data in order to address outstanding questions that are vital to the quest to defeat
					cancer.
				</Typography>

				<LoginButton showLogo={false}>LOGIN</LoginButton>
			</div>
		</div>
	);
};

export default Hero;
