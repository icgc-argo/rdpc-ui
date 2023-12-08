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

import { pageWithPermissions } from '@/app/components/Page';
import useUrlParamState from '@/app/hooks/useUrlParamState';
import { css } from '@emotion/react';

const ClinicalDataPageComp = () => {
	const [urlState, setUrlState] = useUrlParamState('colour', 'blue');
	return (
		<div>
			<div>clinical data</div>
			<div>
				<h1>url param state testing</h1>
				<div
					onClick={() => setUrlState('blue')}
					css={css`
						background: ${urlState === 'blue' && 'pink'};
					`}
				>
					blue
				</div>
				<div
					onClick={() => setUrlState('green')}
					css={css`
						background: ${urlState === 'green' && 'pink'};
					`}
				>
					green
				</div>
				<div
					onClick={() => setUrlState('red')}
					css={css`
						background: ${urlState === 'red' && 'pink'};
					`}
				>
					red
				</div>
			</div>
		</div>
	);
};

const ClinicalDataPage = ({ params: { shortName } }: { params: { shortName: string } }) => {
	const ClinicalDataWithPermissions = pageWithPermissions(ClinicalDataPageComp, {
		acceptedRoles: ['isRDPCAdmin', 'isDCCAdmin', 'isProgramAdmin', 'isDataSubmitter'],
		programShortName: shortName,
	});
	return <ClinicalDataWithPermissions />;
};

export default ClinicalDataPage;
