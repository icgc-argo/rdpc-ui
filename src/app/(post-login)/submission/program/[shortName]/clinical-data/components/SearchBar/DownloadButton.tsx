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

import { CompletionStates } from '@/app/(post-login)/submission/common';
import { useAppConfigContext } from '@/app/hooks/AppProvider';
import useCommonToasters from '@/app/hooks/useCommonToasters';
import usePageContext from '@/app/hooks/usePageContext';
import { css } from '@/lib/emotion';
import { Button, Icon } from '@icgc-argo/uikit';
import React from 'react';
import { Col, Row } from 'react-grid-system';
import urlJoin from 'url-join';

const DownloadButton = ({
	text,
	onClick,
	isLoading = false,
	disabled = false,
}: {
	text: string;
	onClick?: any;
	isLoading?: boolean;
	disabled?: boolean;
}) => (
	<Button
		isLoading={isLoading}
		css={css`
			white-space: nowrap;
		`}
		variant="secondary"
		onClick={onClick}
		disabled={disabled}
	>
		<Icon
			css={css`
				padding-right: 4px;
			`}
			name="download"
			fill="accent2_dark"
			height="12px"
		/>
		{text}
	</Button>
);

const entityTypes: never[] = [];
const tsvDownloadIds = { donorIds: [], submitterDonorIds: [] };

// TODO: this urlJoin case is very common, worth extracting to a hook?
// useAppConfig in hook and just inject programName
// const getUrl = (programShortName) => {
// 	const url = urlJoin(
// 		GATEWAY_API_ROOT,
// 		`/clinical/proxy/program/`,
// 		programShortName,
// 		`/clinical-data-tsv`,
// 	);
// };

const ClinicalDownloadButton = ({
	completionState,
	disabled = false,
}: {
	completionState: CompletionStates;
	disabled?: boolean;
}) => {
	const toaster = useCommonToasters();
	const { GATEWAY_API_ROOT } = useAppConfigContext();
	const p = usePageContext();
	const programShortName = p.getSingleParam('shortName');
	console.log('pp', programShortName);
	//const { downloadFileWithEgoToken } = useAuthContext();

	const [buttonLoadingState, setButtonLoadingState] = React.useState(false);
	const { donorIds, submitterDonorIds } = tsvDownloadIds;

	const query = JSON.stringify({
		donorIds,
		submitterDonorIds,
		entityTypes,
		completionState,
	});

	const onClickDownloadAll = () => {
		const url = urlJoin(
			GATEWAY_API_ROOT,
			`/clinical/proxy/program/`,
			programShortName,
			`/clinical-data-tsv`,
		);
		setButtonLoadingState(true);

		// downloadFileWithEgoToken(url, {
		// 	method: 'post',
		// 	body: query,
		// 	headers: { 'Content-Type': 'application/json' },
		// })
		// 	.then(() => {
		// 		setButtonLoadingState(false);
		// 	})
		// 	.catch((error) => {
		// 		toaster.onDownloadError(error);
		// 		setButtonLoadingState(false);
		// 	});
	};

	return (
		<Row>
			<Col>
				<DownloadButton
					text="Clinical Data"
					onClick={onClickDownloadAll}
					isLoading={buttonLoadingState}
					disabled={disabled}
				/>
			</Col>
		</Row>
	);
};

export default ClinicalDownloadButton;

function downloadFileWithEgoToken(
	url: string,
	arg1: { method: string; body: string; headers: { 'Content-Type': string } },
) {
	throw new Error('Function not implemented.');
}
