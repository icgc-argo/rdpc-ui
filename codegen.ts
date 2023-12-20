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

import { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

// point to .env.local because .env in nextjs is a default committed file
dotenv.config({ path: '.env.local' });

const gqlConfig: CodegenConfig = {
	generates: {
		'./src/__generated__/gateway/': {
			documents: ['src/**/gql/gateway/*.ts'],
			preset: 'client',
			schema: `${process.env.NEXT_PUBLIC_GATEWAY_API_ROOT}/graphql`,
			presetConfig: {
				gqlTagName: 'gql',
			},
		},
		'./src/__generated__/clinical/': {
			documents: ['src/**/gql/clinical/*.ts'],
			preset: 'client',
			schema: `${process.env.NEXT_PUBLIC_CLINICAL_API_ROOT}/graphql`,
			presetConfig: {
				gqlTagName: 'gql',
			},
		},
	},
	ignoreNoDocuments: true,
};

export default gqlConfig;
