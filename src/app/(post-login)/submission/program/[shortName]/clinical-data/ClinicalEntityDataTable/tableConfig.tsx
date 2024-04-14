/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

import { aliasSortNames, defaultClinicalEntityFilters } from '../common';

export const errorColumns = [
	{
		accessorKey: 'entries',
		Header: '# Affected Records',
		id: 'entries',
		maxWidth: 135,
	},
	{
		accessorKey: 'fieldName',
		Header: `Field with Error`,
		id: 'fieldName',
		maxWidth: 215,
	},
	{
		accessorKey: 'errorMessage',
		Header: `Error Description`,
		id: 'errorMessage',
	},
];

export const completionKeys = Object.values(aliasSortNames);
export const completionColumnNames = Object.keys(aliasSortNames);
export const emptyCompletion = {
	DO: 0,
	PD: 0,
	FO: 0,
	NS: 0,
	TR: 0,
	TS: 0,
};

export const noDataCompletionStats = [
	{
		donor_id: 0,
		...emptyCompletion,
	},
];

export const completionColumnHeaders = {
	donor: 'DO',
	primaryDiagnosis: 'PD',
	normalSpecimens: 'NS',
	tumourSpecimens: 'TS',
	treatments: 'TR',
	followUps: 'FO',
};

export const coreCompletionFields = Object.keys(completionColumnHeaders);

export const defaultEntityPageSettings = {
	page: defaultClinicalEntityFilters.page,
	pageSize: defaultClinicalEntityFilters.pageSize,
	sorted: [{ id: 'donorId', desc: true }],
};

export const defaultDonorSettings = {
	...defaultEntityPageSettings,
	sorted: [{ id: 'completionStats.coreCompletionPercentage', desc: false }],
};

export const defaultErrorPageSettings = {
	page: 0,
	pageSize: 5,
	sorted: [{ id: 'donorId', desc: true }],
};
