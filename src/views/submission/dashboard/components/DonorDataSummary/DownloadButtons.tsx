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

import { EGO_JWT_KEY } from '@/global/constants';
import { useAppConfigContext, useToaster } from '@/hooks';
import { Button, Icon, TOAST_VARIANTS, css } from '@icgc-argo/uikit';
import { format as formatDate } from 'date-fns';
import { saveAs } from 'file-saver';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { Col, Row } from 'react-grid-system';
import urlJoin from 'url-join';

const DownloadButton = ({
	text,
	onClick,
	isLoading = false,
}: {
	text: string;
	onClick?: any;
	isLoading?: boolean;
}) => (
	<Button
		isLoading={isLoading}
		css={css`
			white-space: nowrap;
		`}
		variant="secondary"
		onClick={onClick}
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

const DownloadButtons = ({ programShortName }) => {
	const toaster = useToaster();
	const { GATEWAY_API_ROOT } = useAppConfigContext();

	const [buttonLoadingState, setButtonLoadingState] = useState(false);

	const checkResponseIs200 = (res: Response) => {
		if (res.status !== 200) {
			throw new Error('Download failed');
		}
		return res;
	};

	const handleDownloadAllError = () => {
		toaster.addToast({
			interactionType: 'CLOSE',
			title: `Download Error`,
			variant: TOAST_VARIANTS.ERROR,
			content: 'File failed to download.',
		});
		setButtonLoadingState(false);
	};

	const onClickDownloadAll = () => {
		const url = urlJoin(
			GATEWAY_API_ROOT,
			`/clinical/proxy/program/${programShortName}/all-clinical-data`,
		);

		setButtonLoadingState(true);

		fetch(url, {
			headers: {
				authorization: `Bearer ${Cookies.get(EGO_JWT_KEY) || ''}`,
			},
			method: 'GET',
		})
			.then(checkResponseIs200)
			.then((res) => res.blob())
			.then((blob) => {
				const now = formatDate(Date.now(), 'yyyyMMdd');
				const fileName = `${programShortName}_Clinical_Data_${now}.zip`;

				setButtonLoadingState(false);

				saveAs(blob, fileName);
			})
			.catch(handleDownloadAllError);
	};

	return (
		<Row>
			<Col>
				<DownloadButton
					text={'All Clinical Data'}
					onClick={onClickDownloadAll}
					isLoading={buttonLoadingState}
				/>
			</Col>
		</Row>
	);
};

export default DownloadButtons;
