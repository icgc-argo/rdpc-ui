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
import { css, useTheme } from '@/lib/emotion';
import { Icon, Link } from '@icgc-argo/uikit';
import { Fragment } from 'react';
import { Col, Row } from 'react-grid-system';
import urljoin from 'url-join';

const getNavLinks = (docsUrl: string, argoRootUrl: string) => {
	const privacyUrl = urljoin(argoRootUrl, '/page/2/privacy');
	const termsUrl = urljoin(argoRootUrl, '/page/1/terms-and-conditions');
	const publicationUrl = urljoin(argoRootUrl, '/page/77/e3-publication-policy');

	return [
		{
			displayName: 'Contact',
			href: '/contact',
		},
		{
			displayName: 'Documentation',
			href: docsUrl,
			target: '_blank',
		},
		{
			displayName: 'The Team',
			href: '',
		},
		{
			displayName: 'Privacy Policy',
			href: privacyUrl,
			target: '_blank',
		},
		{
			displayName: 'Terms & Conditions',
			href: termsUrl,
			target: '_blank',
		},
		{
			displayName: 'Publication Policy',
			href: publicationUrl,
			target: '_blank',
		},
	];
};

const Footer = () => {
	const theme = useTheme();
	const { UI_VERSION, REGION, DOCS_URL_ROOT, ARGO_ROOT } = useAppConfigContext();

	const subtitle = `RDPC ${REGION} Clinical Data Submission Portal - ${UI_VERSION}`;
	const navLinks = getNavLinks(DOCS_URL_ROOT, ARGO_ROOT);

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
						{navLinks.map(({ displayName, href, target }, index) => (
							<Fragment key={index}>
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
								{index !== navLinks.length - 1 && (
									<Icon width="12px" height="12px" name="slash" fill="grey_1" />
								)}
							</Fragment>
						))}
					</div>
				</Col>
			</Row>
		</footer>
	);
};

export default Footer;
