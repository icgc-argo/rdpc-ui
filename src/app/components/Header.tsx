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

import { AppBar, css, DnaLoader, UserBadge } from '@icgc-argo/uikit';
import Link from 'next/link';
import Image from 'next/image';
import argoLogo from '/public/argo-logo.svg';
import { useAuthContext } from '@/global/utils/auth';
import LoginButton from './LoginButton';

const Header = () => {
	const { egoJwt, loggingIn } = useAuthContext();

	return (
		<header>
			<AppBar
				css={css`
					border-bottom: none;
				`}
			>
				<div css={css({ height: '30px', width: '208px', position: 'relative' })}>
					<Link href="/">
						<Image alt="ICGC ARGO" src={argoLogo} fill />
					</Link>
				</div>

				{/** keep this div. header will have more items, will be "right-aligned" */}
				<div>
					{egoJwt ? (
						<UserBadge
							showGreeting={true}
							firstName={'Test'}
							lastName={'User'}
							title={'DCC Member'}
							css={css`
								color: white;
							`}
						/>
					) : loggingIn ? (
						<DnaLoader />
					) : (
						<LoginButton />
					)}
				</div>
			</AppBar>
		</header>
	);
};

export default Header;
