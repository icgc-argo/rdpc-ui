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
import createEgoUtils from '@icgc-argo/ego-token-utils';
import {
	canWriteToRdpc,
	isDccMember,
	isRdpcAdmin,
} from '@icgc-argo/ego-token-utils/dist/argoRoleChecks';
import { useAppConfigContext } from './AppProvider';

export type UserRoleList = {
	isRDPCAdmin: boolean;
	isDCCAdmin: boolean;
	isProgramAdmin: boolean;
	isDataSubmitter: boolean;
	isCollaborator: boolean;
};

const useUserRole = (egoJwt: string, programId: string): UserRoleList => {
	const { EGO_PUBLIC_KEY } = useAppConfigContext();
	const TokenUtils = createEgoUtils(EGO_PUBLIC_KEY);

	const canReadProgram = (args: { permissions: string[]; programId: string }): boolean =>
		TokenUtils.canReadProgram(args);

	const canReadProgramData: (args: { permissions: string[]; programId: string }) => boolean = (
		args,
	) => TokenUtils.canReadProgramData(args);

	const canWriteProgramData: (args: { permissions: string[]; programId: string }) => boolean = (
		args,
	) => TokenUtils.canWriteProgramData(args);

	const isCollaborator: (args: { permissions: string[]; programId: string }) => boolean = ({
		permissions,
		programId,
	}) =>
		canReadProgramData({ permissions, programId }) &&
		canReadProgram({ permissions, programId }) &&
		!canWriteProgramData({ permissions, programId });

	const isDataSubmitter: (args: { permissions: string[]; programId: string }) => boolean = ({
		permissions,
		programId,
	}) =>
		canWriteProgramData({ permissions, programId }) && canReadProgram({ permissions, programId });

	const isValidJwt = !!egoJwt && TokenUtils.isValidJwt(egoJwt);

	const permissions = (isValidJwt && TokenUtils.getPermissionsFromToken(egoJwt)) || [];

	return {
		isRDPCAdmin: isRdpcAdmin(permissions) && canWriteToRdpc({ permissions, rdpcCode: programId }),
		isDCCAdmin: isDccMember(permissions),
		isProgramAdmin: TokenUtils.isProgramAdmin({
			permissions,
			programId,
		}),
		isDataSubmitter: isDataSubmitter({ permissions, programId }),
		isCollaborator: isCollaborator({ permissions, programId }),
	};
};

export default useUserRole;
