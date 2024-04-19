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

import { useAuthContext } from '@/app/hooks';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { DnaLoader, css } from '@icgc-argo/uikit';
import { redirect } from 'next/navigation';
import useUserRole, { UserRoleList } from '../hooks';

export type PageWithPermissionProps = { permissions: { shortName?: string } };

type AcceptedRole = keyof UserRoleList;

// Component type for this project because we use the Emotion compiler
type JSXComponent<T extends object> = (args: T) => EmotionJSX.Element;

// returns Comp or unauthorized based on acceptedRoles
// params value and types are based on dynamic route of page
export const pageWithPermissions = function <T extends object>(
	Component: JSXComponent<T>,
	permissions: { acceptedRoles: AcceptedRole[]; programShortName?: string },
) {
	return function PageWithPermissions(props: T) {
		const { authLoading, egoJwt } = useAuthContext();

		const programName = permissions.programShortName ?? '';

		const userRoles = useUserRole(egoJwt, programName);

		const isAuthorized = permissions.acceptedRoles.some((roleKey) => userRoles[roleKey]);

		if (authLoading || !egoJwt) {
			return (
				<div
					css={css`
						display: flex;
						align-items: center;
						justify-content: center;
					`}
				>
					<DnaLoader />
				</div>
			);
		}

		if (isAuthorized) {
			return <Component {...props} />;
		} else {
			redirect('/403');
		}
	};
};
