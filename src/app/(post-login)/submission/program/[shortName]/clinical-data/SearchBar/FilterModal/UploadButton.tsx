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
import { Button } from '@icgc-argo/uikit/';
import { fileOpen, supported } from 'browser-fs-access';

type PickerOptions = {
	types: {
		accept: {
			'text/*': string[];
		};
	}[];
	excludeAcceptAllOption: boolean;
	multiple: boolean;
};
type FileSystemHandle = {
	getFile: () => Promise<File>;
	text: () => string[];
};
declare global {
	interface Window {
		showOpenFilePicker: (options: PickerOptions) => FileSystemHandle[];
	}
}

export default function UploadButton({ onUpload }: { onUpload: any }) {
	const formatResult = (texts: string[]) => texts.join().replace(/\s/g, '').replace(/,/g, ', ');

	const handleOnClick = async () => {
		let fileHandle;

		// Refer to File System Access API. Restrict conditions when doing file uploads
		const ifSupportedPickerOpts = {
			types: [
				{
					accept: {
						'text/*': ['.txt', '.csv', '.tsv'],
					},
				},
			],
			excludeAcceptAllOption: true,
			multiple: true,
		};

		// upload button will use showOpenFilePicker (file system access API )method when supported by browser ie. Chrome and Edge, then fall back to legacy method if unsupported ie. FireFox.
		if (supported) {
			try {
				fileHandle = await window.showOpenFilePicker(ifSupportedPickerOpts);
				const files = await Promise.all(fileHandle.map(async (file) => await file.getFile()));
				const texts = await Promise.all(files.map(async (text) => await text.text()));
				// format results so each id has ', ' in between
				const results = formatResult(texts);
				onUpload(results);
				// if (filterTextBox) {
				//   setFilterTextBox(filterTextBox + ', ' + results);
				// } else {
				//   setFilterTextBox(results);
				// }
			} catch (err) {
				return;
			}
		} else {
			// if browser doesn't support File System Access API, then use legacy method
			const unsupportedFiles = await fileOpen([
				{
					description: 'Text files',
					mimeTypes: ['text/*'],
					extensions: ['.txt', '.csv', '.tsv'],
					multiple: true,
				},
			]);

			const unsupportedText = await Promise.all(
				unsupportedFiles.map((file) => {
					return file.text();
				}),
			);
			// format results so each id has ', ' in between
			const results = formatResult(unsupportedText);
			onUpload(results);
		}
	};

	return (
		<Button size="sm" onClick={handleOnClick}>
			Browse
		</Button>
	);
}
