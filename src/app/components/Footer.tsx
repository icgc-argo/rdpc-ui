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

import { getAppConfig } from '@/global/config';
import * as urls from '@/global/urls';
import { css, useTheme } from '@/lib/emotion';
import { Icon, Link } from '@icgc-argo/uikit';
import Image from 'next/image';
import { Col, Row } from 'react-grid-system';
import rdpcLogo from '/public/assets/rdpc-logo.svg';

const { UI_VERSION, REGION } = getAppConfig();
const subtitle = `RDPC ${REGION} Clinical Data Submission Portal - ${UI_VERSION}`;

const Logo = () => <Image src={rdpcLogo} alt="RDPC logo" />;

const links = [
	{
		displayName: 'Contact',
		href: '/contact',
	},
	{
		displayName: 'Documentation',
		href: urls.DOCS_URL_ROOT,
		target: '_blank',
	},
	{
		displayName: 'The Team',
		href: '',
	},
	{
		displayName: 'Privacy Policy',
		href: urls.ARGO_PRIVACY_PAGE,
		target: '_blank',
	},
	{
		displayName: 'Terms & Conditions',
		href: urls.ARGO_TERMS_PAGE,
		target: '_blank',
	},
	{
		displayName: 'Publication Policy',
		href: urls.ARGO_PUBLICATION_PAGE,
		target: '_blank',
	},
];

export default function Footer() {
	const theme = useTheme();
	return (
		<footer
			css={css`
				font-size: 14px;
				background: #fff;
				z-index: 1;
				padding: 0 14px 0 24px;
				border-top: 1px solid ${theme.colors.grey_2};
				font-size: 11px;
				min-height: 58px;

				& a + svg {
					position: relative;
					top: 3px;
					margin: 0px 8px;
				}
			`}
		>
			<Row
				css={css`
					min-height: 58px;
				`}
				justify="between"
				nogutter
			>
				<Col
					md={5}
					css={css`
						display: flex;
						align-items: center;
					`}
				>
					{/** copyright and ARGO logo */}
					<div>
						© {new Date().getFullYear()} ICGC ARGO RDPC. All rights reserved.
						<br />
						{subtitle}
					</div>
				</Col>

				<Col
					md={7}
					css={css`
						display: flex;
						align-items: center;
						font-size: 12px;
						justify-content: flex-end;
						padding-left: 22px;
					`}
				>
					{/** nav links */}
					<div
						css={css`
							margin-right: 22px;
						`}
					>
						{links.map(({ displayName, href, target }, index) => (
							<>
								<Link
									target={target}
									href={href}
									rel={target === '_blank' ? 'noreferrer noopener' : ''}
									css={css`
										color: ${theme.colors.primary};
									`}
								>
									{displayName}
								</Link>
								{index !== links.length - 1 && (
									<Icon width="12px" height="12px" name="slash" fill="grey_1" />
								)}
							</>
						))}
					</div>

					<div>
						<Logo />
					</div>
				</Col>
			</Row>
		</footer>
	);
}
