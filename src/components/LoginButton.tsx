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

import { useAppConfigContext } from '@/hooks/AppProvider';
import { css } from '@/lib/emotion';
import { Button, Icon, useTheme } from '@icgc-argo/uikit';

const LoginButton = () => {
	const { EGO_LOGIN_URL } = useAppConfigContext();
	const theme = useTheme();
	return (
		<div
			css={css`
				display: flex;
				height: 100%;
			`}
		>
			<a
				id="link-login"
				href={EGO_LOGIN_URL}
				css={css`
					align-self: center;
					text-decoration: none;
					padding: 0 16px;
				`}
			>
				<Button
					css={css`
						padding: 8px 18px 8px 12px;
						border: 1px solid ${theme.colors.grey_1};
					`}
				>
					<span
						css={css`
							display: flex;
							justify-content: center;
							align-items: center;
						`}
					>
						<Icon
							name="google"
							height="17px"
							width="17px"
							css={css`
								margin-right: 5px;
							`}
						/>
						Login
					</span>
				</Button>
			</a>
		</div>
	);
};

export default LoginButton;
