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
import {
	ClinicalRecord,
	ClinicalRegistrationData,
	GetRegistrationQuery,
	Maybe,
} from '@/__generated__/graphql';
import { get, union } from 'lodash';
import FileTable from './FileTable';

export type FileTableData = ClinicalRegistrationData & {
	row: number;
	isNew: boolean;
};

const recordsToFileTable = (
	records: Maybe<ClinicalRecord>[],
	newRows: Array<number>,
): FileTableData[] =>
	records.map((record) => {
		const fields = get(record, 'fields') || [];
		const data = fields.reduce(
			(acc, cur) => ({
				...acc,
				[cur.name]: cur.value,
			}),
			{} as any,
		);

		return {
			...data,
			row: record?.row,
			isNew: newRows.includes(record?.row || -1),
		};
	});

const FilePreview = ({
	registration,
}: {
	registration: GetRegistrationQuery['clinicalRegistration'];
}) => {
	const fileRecords = get(registration, 'records');

	const {
		createdAt = '',
		creator = '',
		fileName = '',
		alreadyRegistered: { count: alreadyRegisteredCount = 0 },
		newDonors: { rows: newDonors },
		newSamples: { rows: newSamples },
		newSpecimens: { rows: newSpecimens },
	} = registration;

	const submissionInfo = { createdAt, creator, fileName };
	const newRows = union(newDonors, newSamples, newSpecimens) as number[];
	const stats = {
		newCount: newRows.length,
		existingCount: alreadyRegisteredCount,
	};

	const records = recordsToFileTable(fileRecords, newRows);

	return (
		<FileTable
			records={records}
			stats={stats}
			submissionInfo={
				submissionInfo as {
					createdAt: string;
					creator: string;
					fileName: string;
				}
			}
		/>
	);
};

export default FilePreview;
