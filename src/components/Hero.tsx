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

import { useAppConfigContext } from '@/hooks';
import { BUTTON_SIZES, Button, Icon, Typography, css, useTheme } from '@icgc-argo/uikit';
import Link from 'next/link';
import galaxyImage from '../../../public/assets/galaxy.png';
import RegionBanner from './RegionBanner';

const Hero = () => {
	const theme = useTheme();
	const { REGION, PLATFORM_UI_ROOT, EGO_LOGIN_URL } = useAppConfigContext();
	return (
		<div
			css={css({
				backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 41.37%, #000000 100%), url(${galaxyImage.src})`,
				backgroundSize: 'cover',
				backgroundColor: `${theme.colors.primary}`,
				width: '100%',
			})}
		>
			<div
				css={css`
					padding: 17px 0 0 17px;
					> span,
					a {
						line-height: 28px;
						color: white;
						font-size: 12px;
						font-weight: 600;
					}
				`}
			>
				<Icon
					name="chevron_left"
					fill="white"
					width="8px"
					height="8px"
					css={css`
						position: relative;
						top: 1px;
						margin-right: 4px;
					`}
				/>
				<Link
					href={PLATFORM_UI_ROOT}
					css={css({
						textDecoration: 'underline',
					})}
				>{`Back to ICGC ARGO`}</Link>
			</div>{' '}
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
				<RegionBanner region={REGION} />

				<Typography
					variant="hero"
					color="white"
					css={css({
						margin: '18px 0px 35px',
						textAlign: 'center',
						fontWeight: 600,
					})}
					as="h1"
				>
					RDPC Clinical Data Submission Portal{' '}
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
					ARGO) aims to{' '}
					<b>uniformly analyze specimens from 100,000 donors with high quality clinical data</b> in
					order to address outstanding questions that are vital to the quest to defeat cancer.
				</Typography>

				<Link
					href={EGO_LOGIN_URL}
					css={css`
						text-decoration: none;
					`}
				>
					<Button
						size={BUTTON_SIZES.MD}
						css={css`
							font-size: 24px;
							padding: 6px 36px 4px;
						`}
					>
						LOGIN
					</Button>
				</Link>
			</div>
		</div>
	);
};

export default Hero;
