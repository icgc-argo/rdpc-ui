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

import { useAuthContext } from '@/app/hooks/AuthProvider';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { DnaLoader, css } from '@icgc-argo/uikit';
import { notFound, redirect } from 'next/navigation';
import useUserRole, { UserRoleList } from '../hooks/useUserRole';

// Nextjs dynamic routing params
type URLParams = {
	params: { [key: string]: string | string[] | undefined } | undefined;
	searchParams: { [key: string]: string | string[] | undefined } | undefined;
};

type AcceptedRole = keyof UserRoleList;
type PageProps = {
	Component: Component;
	acceptedRoles: AcceptedRole[];
	urlParams: URLParams;
};

const Page = ({ Component, acceptedRoles, urlParams }: PageProps) => {
	const { egoJwt } = useAuthContext();
	const programParam = urlParams?.params?.shortName;

	const programName = typeof programParam === 'string' ? programParam : '';

	const userRoles = useUserRole(egoJwt, programName);

	const isAuthorized = acceptedRoles.some((roleKey) => userRoles[roleKey]);

	if (!egoJwt) {
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
	} else if (Array.isArray(programName)) {
		// a url with multiple program names is invalid
		notFound();
	} else if (isAuthorized) {
		return <Component {...urlParams} />;
	}

	redirect('/403');
};

// Component type for this project because we use the Emotion compiler
type Component = (...args: any[]) => EmotionJSX.Element;

// returns Comp or unauthorized based on acceptedRoles
// params value and types are based on dynamic route of page
export const pageWithPermissions =
	// eslint-disable-next-line react/display-name
	(Component: Component, acceptedRoles: AcceptedRole[]) => (params: any) => {
		const props = { Component, acceptedRoles, urlParams: params };

		// needs to be Component or hook because we use hooks to check for auth/roles
		return <Page {...props} />;
	};
