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

import { ClinicalInput } from '@/__generated__/clinical/graphql';

export const aliasSortNames = {
	donor_id: 'donorId',
	program_id: 'programId',
	submitter_id: 'submitterId',
	DO: 'donorId',
	PD: 'primaryDiagnoses',
	NS: 'specimens',
	TS: 'familyHistory',
	TR: 'treatments',
	FO: 'followUps',
};

export const aliasedEntityNames = {
	donor: 'donor',
	sampleRegistration: 'sample_registration',
	specimens: 'specimen',
	primaryDiagnoses: 'primary_diagnosis',
	familyHistory: 'family_history',
	treatment: 'treatment',
	chemotherapy: 'chemotherapy',
	immunotherapy: 'immunotherapy',
	surgery: 'surgery',
	radiation: 'radiation',
	followUps: 'follow_up',
	hormoneTherapy: 'hormone_therapy',
	exposure: 'exposure',
	comorbidity: 'comorbidity',
	biomarker: 'biomarker',
};

export const clinicalEntityFields = Object.keys(aliasedEntityNames);

export type ClinicalFilter = {
	entityTypes: string[];
	page: number;
	pageSize: number;
	donorIds?: string[];
	submitterDonorIds?: string[];
	completionState?: CompletionStates;
	sort?: string;
};

export enum CompletionStates {
	all = 'all',
	invalid = 'invalid',
	complete = 'complete',
	incomplete = 'incomplete',
}

export const defaultClinicalEntityFilters: ClinicalInput = {
	entityTypes: clinicalEntityFields,
	page: 0,
	pageSize: 20,
	donorIds: [],
	submitterDonorIds: [],
	completionState: CompletionStates['all'],
	sort: aliasSortNames.donor_id,
};
