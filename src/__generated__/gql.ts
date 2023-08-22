/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import * as types from './graphql';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
	'\n\tquery ProgramsList {\n\t\tprograms {\n\t\t\tshortName\n\t\t\tname\n\t\t\tcancerTypes\n\t\t\tcountries\n\t\t\tmembershipType\n\t\t\tgenomicDonors\n\t\t\tsubmittedDonors\n\t\t\tcommitmentDonors\n\t\t\tusers {\n\t\t\t\temail\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t\trole\n\t\t\t}\n\t\t}\n\t}\n':
		types.ProgramsListDocument,
	'\n\tquery SideMenu {\n\t\tprograms {\n\t\t\tshortName\n\t\t}\n\t}\n': types.SideMenuDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
	source: '\n\tquery ProgramsList {\n\t\tprograms {\n\t\t\tshortName\n\t\t\tname\n\t\t\tcancerTypes\n\t\t\tcountries\n\t\t\tmembershipType\n\t\t\tgenomicDonors\n\t\t\tsubmittedDonors\n\t\t\tcommitmentDonors\n\t\t\tusers {\n\t\t\t\temail\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t\trole\n\t\t\t}\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery ProgramsList {\n\t\tprograms {\n\t\t\tshortName\n\t\t\tname\n\t\t\tcancerTypes\n\t\t\tcountries\n\t\t\tmembershipType\n\t\t\tgenomicDonors\n\t\t\tsubmittedDonors\n\t\t\tcommitmentDonors\n\t\t\tusers {\n\t\t\t\temail\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t\trole\n\t\t\t}\n\t\t}\n\t}\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
	source: '\n\tquery SideMenu {\n\t\tprograms {\n\t\t\tshortName\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery SideMenu {\n\t\tprograms {\n\t\t\tshortName\n\t\t}\n\t}\n'];

export function gql(source: string) {
	return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
	TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
