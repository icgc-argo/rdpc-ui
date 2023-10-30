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

import { ApolloClient, ApolloLink, InMemoryCache } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
export { gql } from '@/__generated__/gql';

const createInMemoryCache = () =>
	new InMemoryCache({
		typePolicies: {
			// define cache IDs. default is item.id
			Program: {
				keyFields: ['shortName'],
			},
			ClinicalRegistrationData: {
				keyFields: ['programShortName'],
			},
			ClinicalSubmissionData: {
				keyFields: ['programShortName'],
			},
		},
	});

type Config = {
	gateway: string;
	jwt: string;
};
export const createApolloClient = (config: Config) => {
	const clientSideCache = createInMemoryCache();

	const httpLink = createUploadLink({
		uri: config.gateway,
	});

	const jwt = config.jwt;

	const authLink = new ApolloLink((operation, forward) => {
		operation.setContext(({ headers }: { headers: any }) => ({
			headers: {
				authorization: `Bearer ${jwt}`,
				...headers,
			},
		}));
		return forward(operation);
	});

	const errorLink = onError(({ graphQLErrors, networkError }) => {
		if (graphQLErrors)
			graphQLErrors.forEach(({ message, locations, path }) =>
				console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
			);
		if (networkError) console.log(`[Network error]: ${networkError}`);
	});

	const additiveLink = ApolloLink.from([authLink, errorLink, httpLink]);

	return new ApolloClient({
		link: additiveLink,
		cache: clientSideCache,
		connectToDevTools: true,
	});
};
