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

import { useQuery } from '@apollo/client';
import ProgramList from './components/ProgramList';
import PROGRAMS_LIST_QUERY from './gql/PROGRAMS_LIST_QUERY';

export default function Submission() {
	//  @ts-ignore gql stuff do later
	const { data: { programs = [] } = {}, loading, error } = useQuery(PROGRAMS_LIST_QUERY);

	// const programsWithAdmins = programs.map((program) => {
	// 	const users = get(
	// 		programsWithUsers.find((pp) => program.shortName == pp.shortName),
	// 		'users',
	// 		[],
	// 	);
	// 	return {
	// 		...program,
	// 		...(programsWithUsers.length > 0 ? { administrators: filter(users, { role: 'ADMIN' }) } : {}),
	// 	};
	// });
	if (loading) return <div> Loader.....</div>;
	if (error) return <div>eerrors</div>;
	return <ProgramList programs={programs.programs} />;
}
