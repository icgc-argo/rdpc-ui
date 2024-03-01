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

import { Client } from '@elastic/elasticsearch';
import indexSettings from './file_centric/file_mapping.json';
import indexData from './file_centric/sample_file_centric.json';

(async () => {
	const TEST_INDEX = 'file_centric';
	const ELASTICSEARCH_HOST = 'http://localhost:9200';
	const esClient = new Client({
		node: ELASTICSEARCH_HOST,
		ssl: {
			rejectUnauthorized: false,
		},
	});
	try {
		await esClient.ping();
	} catch (err) {
		console.log(`failing to ping elasticsearch at ${ELASTICSEARCH_HOST}: `, err);
		throw err;
	}
	try {
		console.log(`deleting index ${TEST_INDEX}`);
		await esClient.indices.delete({
			index: TEST_INDEX,
		});
	} catch (err) {
		console.log(`could not delete index ${TEST_INDEX}: `, err);
		if ((await esClient.indices.exists({ index: TEST_INDEX })).body) {
			throw err;
		}
	}

	console.log(`creating index ${TEST_INDEX}`);

	await esClient.indices.create({
		index: TEST_INDEX,
		body: indexSettings,
	});

	console.log('index created');

	await Promise.all(
		indexData.map((doc, index) => {
			console.log(`doc_${index}`);
			return esClient.index({
				index: TEST_INDEX,
				refresh: 'wait_for',
				body: {
					...doc,
					donors: [doc.donors].map((donor) => ({
						...donor,
						specimens: [donor.specimens].map((specimen) => ({
							...specimen,
							samples: [specimen.samples],
						})),
					})),
					repositories: [doc.repositories],
				},
			});
		}),
	);

	console.log('Complete!');
})();
