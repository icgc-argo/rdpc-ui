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

import { MenuItem } from '@icgc-argo/uikit';
import Link from 'next/link';

export default function ProgramMenu({
	programs,
	searchQuery,
}: {
	programs: { shortName: string }[];
	searchQuery: string;
}) {
	const filteredPrograms = programs.filter(
		({ shortName }) => !searchQuery.length || shortName.search(new RegExp(searchQuery, 'i')) > -1,
	);
	//const currentViewingProgramIndex = filteredPrograms;
	// 	.map(({ shortName }) => shortName)
	// 	.indexOf(String(pageContext.query.shortName));
	// const { activeItem: activeProgramIndex, toggleItem: toggleProgramIndex } = useToggledSelectState(
	// 	currentViewingProgramIndex,
	// );
	return (
		<>
			<Link href={'PROGRAMS_LIST_PATH'}>
				<MenuItem
					level={2}
					content={'All Programs'}
					//selected={pageContext.pathname === PROGRAMS_LIST_PATH}
				/>
			</Link>

			{filteredPrograms.map((program, programIndex) => (
				<MenuItem
					key={program.shortName}
					content={program.shortName}
					//onClick={() => toggleProgramIndex(programIndex)}
					//selected={programIndex === activeProgramIndex}
				>
					{program.shortName}
					{/* <LinksToProgram
						program={program}
						isCurrentlyViewed={programIndex === currentViewingProgramIndex}
					/> */}
				</MenuItem>
			))}
		</>
	);
}