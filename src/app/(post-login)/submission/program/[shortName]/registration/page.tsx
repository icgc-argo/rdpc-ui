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

import Instructions from '@/app/components/page/submission/program/registration/Instructions';
import { useMutation, useQuery } from '@apollo/client';
import CLINICAL_SCHEMA_VERSION_QUERY from './gql/CLINICAL_SCHEMA_VERSION_QUERY';
import UPLOAD_REGISTRATION_MUTATION from './gql/UPLOAD_REGISTRATION_MUTATION';

export default function Register({ params: { shortName } }: { params: { shortName: string } }) {
	const { data, loading, error } = useQuery(CLINICAL_SCHEMA_VERSION_QUERY);

	// upload file
	const [uploadFile, { loading: isUploading }] = useMutation(UPLOAD_REGISTRATION_MUTATION, {
		onError: () => {
			//commonToaster.unknownError();
			console.error();
		},
	});

	const handleUpload = (file: File) =>
		uploadFile({
			variables: { shortName, registrationFile: file },
		});

	return (
		<div>
			<Instructions
				dictionaryVersion={'11'}
				handleUpload={handleUpload}
				isUploading={isUploading}
			/>
		</div>
	);
}
