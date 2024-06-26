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

import { CLINICAL_TEMPLATE_PATH, CONTACT_PAGE_PATH } from '@/global/constants';
import { useAppConfigContext } from '@/hooks';
import { css } from '@/lib/emotion';
import {
	BUTTON_SIZES,
	BUTTON_VARIANTS,
	Button,
	FileSelectButton,
	Icon,
	InstructionBox,
	Typography,
	Link as UIKitLink,
} from '@icgc-argo/uikit';
import Link from 'next/link';
import urlJoin from 'url-join';

const boxButtonStyle = css`
	margin-top: 10px;
`;

const instructionBoxButtonIconStyle = css`
	margin-right: 5px;
`;
const instructionBoxButtonContentStyle = css`
	display: flex;
	align-items: center;
`;

const Instructions = ({
	dictionaryVersion = '',
	handleUpload,
	isUploading,
	handleRegister,
	flags,
}: {
	dictionaryVersion: string;
	handleUpload: (f: FileList) => void;
	isUploading: boolean;
	handleRegister: () => void;
	flags: { uploadEnabled: boolean; registrationEnabled: boolean };
}) => {
	const { DOCS_URL_ROOT, GATEWAY_API_ROOT } = useAppConfigContext();
	const dictionaryPageUrl = urlJoin(DOCS_URL_ROOT, '/dictionary');
	const dictionaryVersionDisplay = `Data Dictionary v${dictionaryVersion}.`;

	// download template
	const downloadFileTemplate = () =>
		window.location.assign(
			urlJoin(GATEWAY_API_ROOT, CLINICAL_TEMPLATE_PATH, 'sample_registration.tsv'),
		);

	return (
		<div
			css={css`
				padding: 8px;
			`}
		>
			<InstructionBox
				steps={[
					<>
						<Typography variant="data" component="span">
							BEFORE YOU START: Download the registration template and format it using{' '}
							<Link target="_blank" href={dictionaryPageUrl}>
								{dictionaryVersionDisplay}
							</Link>
						</Typography>
						<Button
							variant={BUTTON_VARIANTS.SECONDARY}
							size={BUTTON_SIZES.SM}
							css={boxButtonStyle}
							onClick={downloadFileTemplate}
						>
							<span css={instructionBoxButtonContentStyle}>
								<Icon
									name="download"
									fill="accent2_dark"
									height="12px"
									css={instructionBoxButtonIconStyle}
								/>{' '}
								File Template
							</span>
						</Button>
					</>,
					<>
						<Typography variant="data" component="span">
							1. Upload your formatted registration TSV file.
						</Typography>
						<FileSelectButton
							css={boxButtonStyle}
							isAsync
							variant={BUTTON_VARIANTS.SECONDARY}
							size={BUTTON_SIZES.SM}
							isLoading={isUploading}
							onFilesSelect={async (files) => {
								if (files[0]) await handleUpload(files);
							}}
							disabled={!flags.uploadEnabled}
						>
							<span css={instructionBoxButtonContentStyle}>
								<Icon
									name="upload"
									height="12px"
									fill={flags.uploadEnabled ? 'accent2_dark' : 'white'}
									css={instructionBoxButtonIconStyle}
								/>{' '}
								Upload File
							</span>
						</FileSelectButton>
					</>,
					<>
						<Typography variant="data" component="span">
							2. When your sample list is valid and QC is complete, submit your registration.
						</Typography>
						<Button
							css={boxButtonStyle}
							variant={BUTTON_VARIANTS.PRIMARY}
							size={BUTTON_SIZES.SM}
							disabled={!flags.registrationEnabled}
							onClick={handleRegister}
						>
							Register Samples
						</Button>
					</>,
				]}
				footer={
					<div
						css={css`
							text-align: center;
							width: 100%;
							padding-bottom: 10px;
							padding-top: 8px;
						`}
					>
						<Typography variant="data">
							If you have any changes to previously registered data, please {` `}
							<Link href={CONTACT_PAGE_PATH}>
								<UIKitLink>contact the DCC</UIKitLink>
							</Link>
						</Typography>
					</div>
				}
			/>
		</div>
	);
};

export default Instructions;
