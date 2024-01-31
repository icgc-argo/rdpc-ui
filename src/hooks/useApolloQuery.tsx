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
	useQuery,
} from '@apollo/client';

const useApolloQuery = <TData, TVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVariables>,
	api: keyof typeof apiName,
	options?: QueryHookOptions<any, OperationVariables> | undefined,
): QueryResult<TData, TVariables> => {
	const mergedOptions = { context: { apiName: api }, ...options };
	// @ts-expect-error apollo NoInfer type isn't playing nice with the 'mergedOptions'
	return useQuery(query, mergedOptions);
};

export const useGatewayQuery = <TData, TVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVariables>,
	options?: QueryHookOptions<any, OperationVariables> | undefined,
) => {
	return useApolloQuery(query, apiName.gateway, options);
};

export const useClinicalQuery = <TData, TVariables>(
	query: DocumentNode | TypedDocumentNode<TData, TVariables>,
	options?: QueryHookOptions<any, OperationVariables> | undefined,
) => {
	return useApolloQuery(query, apiName.clinical, options);
};
