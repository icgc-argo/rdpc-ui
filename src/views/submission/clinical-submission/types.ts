import { FileRecord } from './components/FilesNavigator/types';

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

export type ClinicalSubmissionRecord = {
	row: number;
	fields: {
		value: string;
		name: keyof FileRecord;
	}[];
};

export type ClinicalSubmissionError = {
	message: string;
	row: number;
	field: string;
	value: string;
	donorId: string;
};

type ClinicalSubmissionUpdate = {
	row: number;
	field: string;
	newValue: string;
	oldValue: string;
	donorId: string;
};

type SubmissionStatus =
	| 'OPEN'
	| 'VALID'
	| 'INVALID'
	| 'PENDING_APPROVAL'
	| 'INVALID_BY_MIGRATION'
	| null;

export type Stats = {
	noUpdate: Array<ClinicalSubmissionRecord['row']>;
	updated: Array<ClinicalSubmissionRecord['row']>;
	new: Array<ClinicalSubmissionRecord['row']>;
	errorsFound: Array<ClinicalSubmissionRecord['row']>;
};

export const clinicalStatuses = {
	SUCCESS: 'SUCCESS',
	WARNING: 'WARNING',
	ERROR: 'ERROR',
	NONE: 'NONE',
	UPDATE: 'UPDATE',
} as const;
type ClinicalEntityStatus = keyof typeof clinicalStatuses;

export type ClinicalEntity = {
	stats: Stats;
	createdAt: string;
	creator: string;
	fileName: string;
	schemaErrors: ClinicalSubmissionError[];
	dataErrors: ClinicalSubmissionError[];
	dataUpdates: ClinicalSubmissionUpdate[];
	dataWarnings: ClinicalSubmissionError[];
	displayName: string;
	clinicalType: string;
	records: ClinicalSubmissionRecord[];
	recordsCount: number;
	status: ClinicalEntityStatus;
};

export type ClinicalFileError = {
	message: string;
	fileNames: string[];
	code: string;
};

export type ClinicalSubmission = {
	clinicalState: string;
	clinicalVersion: string;
	clinicalFileErrors: ClinicalFileError[];
	clinicalEntities: ClinicalEntity[];
	isPendingApproval: boolean;
	isSubmissionValidated: boolean;
	updateInfo: {
		updatedBy: string;
		updatedAt: string;
	};
};

// table
export type ErrorNotificationDefaultColumns = {
	donorId: string;
	field: string;
	message: string;
	row: number;
	value: string;
};

export type ErrorTableColumns = ErrorNotificationDefaultColumns & {
	fileName: string;
};

export type ErrorTableColumnProperties = {
	accessorKey: keyof ErrorTableColumns;
	header: string;
	maxSize?: number;
};

export type ClinicalEntityType =
	| 'donor'
	| 'specimen'
	| 'primary_diagnosis'
	| 'treatment'
	| 'chemotherapy'
	| 'hormone_therapy'
	| 'immunotherapy'
	| 'radiation'
	| 'surgery'
	| 'follow_up'
	| 'family_history'
	| 'exposure'
	| 'comorbidity'
	| 'biomarker';
