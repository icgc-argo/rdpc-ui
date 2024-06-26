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

import GET_REGISTRATION_QUERY from '@/gql/clinical/GET_REGISTRATION_QUERY';
import { useGatewayQuery, useSubmissionSystemStatus } from '@/hooks';
import { Progress } from '@icgc-argo/uikit';
import get from 'lodash/get';
import { ComponentProps, ComponentType } from 'react';

const SampleRegistrationProgressBar: ComponentType<{ programShortName: string }> = ({
	programShortName,
}) => {
	const { data: { clinicalRegistration = undefined } = {} } = useGatewayQuery(
		GET_REGISTRATION_QUERY,
		{
			variables: { shortName: programShortName },
		},
	);

	const schemaOrValidationErrors = get(clinicalRegistration, 'errors', []);

	const { isDisabled: isSubmissionSystemDisabled } = useSubmissionSystemStatus();

	const progressStates: {
		upload: ComponentProps<typeof Progress.Item>['state'];
		register: ComponentProps<typeof Progress.Item>['state'];
	} = {
		upload: isSubmissionSystemDisabled
			? 'locked'
			: clinicalRegistration && clinicalRegistration.records.length > 0
			? 'success'
			: schemaOrValidationErrors.length > 0
			? 'error'
			: 'disabled',
		register: isSubmissionSystemDisabled
			? 'locked'
			: clinicalRegistration && clinicalRegistration.records.length > 0
			? 'pending'
			: schemaOrValidationErrors.length > 0
			? 'disabled'
			: 'disabled',
	};

	return (
		<Progress>
			<Progress.Item state={progressStates.upload} text="Upload" />
			<Progress.Item state={progressStates.register} text="Register" />
		</Progress>
	);
};

export default SampleRegistrationProgressBar;
