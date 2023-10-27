/*
 * Copyright (c) 2022 The Ontario Institute for Cancer Research. All rights reserved
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

import { css, Modal, ModalContainer, Typography } from '@icgc-argo/uikit';
import { ComponentProps, ComponentType, ReactNode } from 'react';
import SubmissionSummaryTable from './SubmissionSummaryTable';

const SignOffModalCont: ComponentType<{ children?: ReactNode }> = ({ children }) => (
	<ModalContainer
		css={css`
			max-width: 1120px;
		`}
	>
		{children}
	</ModalContainer>
);

const SignOffValidationModal = ({
	clinicalEntities,
	onCloseClick,
	onActionClick,
	onCancelClick,
	hasUpdate,
}: {
	clinicalEntities: any;
	hasUpdate: boolean;
	onCloseClick: ComponentProps<typeof Modal>['onCloseClick'];
	onActionClick: ComponentProps<typeof Modal>['onActionClick'];
	onCancelClick: ComponentProps<typeof Modal>['onCancelClick'];
}) => {
	return (
		<Modal
			actionButtonText="yes, sign off"
			actionButtonId="modal-confirm-sign-off"
			title={
				<span
					css={css`
						padding-right: 20px;
					`}
				>
					Are you sure you want to sign-off your clinical submission?
				</span>
			}
			onCloseClick={onCloseClick}
			onActionClick={onActionClick}
			onCancelClick={onCancelClick}
			ContainerEl={SignOffModalCont}
		>
			<div>
				{hasUpdate
					? 'The DCC will be notified of the following updates to previously released data and your submission will be locked until approval.'
					: 'The following clinical data will be submitted.'}
			</div>
			<div
				css={css`
					margin: 10px 5px;
				`}
			>
				<Typography color="secondary" bold variant="sectionHeader">
					Clinical Submission Summary
				</Typography>
			</div>
			<SubmissionSummaryTable clinicalEntities={clinicalEntities} />
		</Modal>
	);
};

export default SignOffValidationModal;
