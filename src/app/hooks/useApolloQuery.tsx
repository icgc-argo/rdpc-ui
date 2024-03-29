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
import { apiName } from '@/lib/gql';
import {
	DocumentNode,
	OperationVariables,
	QueryHookOptions,
	QueryResult,
	TypedDocumentNode,
	useMutation,
	useQuery,
} from '@apollo/client';

type APIType = keyof typeof apiName;
type QueryType<TData, TVariables> = DocumentNode | TypedDocumentNode<TData, TVariables>;
type OptionsType = QueryHookOptions<any, OperationVariables> | undefined;
type MutationOptions = OptionsType & { refetchQueries?: any };

const useApolloQuery = <TData, TVariables>(
	query: QueryType<TData, TVariables>,
	api: APIType,
	options?: OptionsType,
): QueryResult<TData, TVariables> => {
	const mergedOptions = { context: { apiName: api }, ...options };
	// @ts-expect-error apollo NoInfer type isn't playing nice with the 'mergedOptions'
	return useQuery(query, mergedOptions);
};

export const useGatewayQuery = <TData, TVariables>(
	query: QueryType<TData, TVariables>,
	options?: OptionsType,
) => {
	return useApolloQuery(query, apiName.gateway, options);
};

export const useClinicalQuery = <TData, TVariables>(
	query: QueryType<TData, TVariables>,
	options?: OptionsType,
) => {
	return useApolloQuery(query, apiName.clinical, options);
};

// Mutation
const useApolloMutation = <TData, TVariables>(
	mutation: QueryType<TData, TVariables>,
	api: APIType,
	options?: MutationOptions,
) => {
	const mergedOptions = { context: { apiName: api }, ...options };
	// @ts-expect-error apollo NoInfer type isn't playing nice with the 'mergedOptions'
	return useMutation(mutation, mergedOptions);
};

export const useGatewayMutation = <TData, TVariables>(
	mutation: QueryType<TData, TVariables>,
	options?: MutationOptions,
) => {
	return useApolloMutation(mutation, apiName.gateway, options);
};

export const useClinicalMutation = <TData, TVariables>(
	mutation: QueryType<TData, TVariables>,
	options?: MutationOptions,
) => {
	return useApolloMutation(mutation, apiName.clinical, options);
};
