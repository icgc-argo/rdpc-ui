/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
import * as types from "./graphql";

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
  "\n  mutation ClearClinicalRegistration($shortName: String!, $registrationId: String!) {\n    clearClinicalRegistration(shortName: $shortName, registrationId: $registrationId)\n  }\n":
    types.ClearClinicalRegistrationDocument,
  "\n\tquery ClinicalSchemaVersion {\n\t\tclinicalSubmissionSchemaVersion\n\t}\n":
    types.ClinicalSchemaVersionDocument,
  "\n  mutation CommitClinicalRegistration(\n    $shortName: String!\n    $registrationId: String!\n  ) {\n    commitClinicalRegistration(\n      shortName: $shortName\n      registrationId: $registrationId\n    )\n  }\n":
    types.CommitClinicalRegistrationDocument,
  "\n  query GetRegistration($shortName: String!) {\n    clinicalRegistration(shortName: $shortName) {\n      id\n      programShortName\n      creator\n      fileName\n      createdAt\n      records {\n        row\n        fields {\n          name\n          value\n        }\n      }\n      errors {\n        type\n        message\n        row\n        field\n        value\n        sampleId\n        donorId\n        specimenId\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n      newDonors {\n        count\n        rows\n      }\n      newSpecimens {\n        count\n        rows\n      }\n      newSamples {\n        count\n        rows\n      }\n      alreadyRegistered {\n        count\n        rows\n      }\n    }\n  }    \n":
    types.GetRegistrationDocument,
  "\n\tquery ProgramsList {\n\t\tprograms {\n\t\t\tshortName\n\t\t\tname\n\t\t\tcancerTypes\n\t\t\tcountries\n\t\t\tmembershipType\n\t\t\tgenomicDonors\n\t\t\tsubmittedDonors\n\t\t\tcommitmentDonors\n\t\t\tusers {\n\t\t\t\temail\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t\trole\n\t\t\t}\n\t\t}\n\t}\n":
    types.ProgramsListDocument,
  "\n\tquery SideMenu {\n\t\tprograms {\n\t\t\tshortName\n\t\t}\n\t}\n":
    types.SideMenuDocument,
  "\n\tmutation UploadRegistration($shortName: String!, $registrationFile: Upload!) {\n\t\tuploadClinicalRegistration(shortName: $shortName, registrationFile: $registrationFile) {\n\t\t\tid\n      programShortName\n      creator\n      fileName\n      createdAt\n      records {\n        row\n        fields {\n          name\n          value\n        }\n      }\n      errors {\n        type\n        message\n        row\n        field\n        value\n        sampleId\n        donorId\n        specimenId\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n      newDonors {\n        count\n        rows\n      }\n      newSpecimens {\n        count\n        rows\n      }\n      newSamples {\n        count\n        rows\n      }\n      alreadyRegistered {\n        count\n        rows\n      }\n\t\t}\n\t}\n":
    types.UploadRegistrationDocument,
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
  source: "\n  mutation ClearClinicalRegistration($shortName: String!, $registrationId: String!) {\n    clearClinicalRegistration(shortName: $shortName, registrationId: $registrationId)\n  }\n",
): (typeof documents)["\n  mutation ClearClinicalRegistration($shortName: String!, $registrationId: String!) {\n    clearClinicalRegistration(shortName: $shortName, registrationId: $registrationId)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n\tquery ClinicalSchemaVersion {\n\t\tclinicalSubmissionSchemaVersion\n\t}\n",
): (typeof documents)["\n\tquery ClinicalSchemaVersion {\n\t\tclinicalSubmissionSchemaVersion\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  mutation CommitClinicalRegistration(\n    $shortName: String!\n    $registrationId: String!\n  ) {\n    commitClinicalRegistration(\n      shortName: $shortName\n      registrationId: $registrationId\n    )\n  }\n",
): (typeof documents)["\n  mutation CommitClinicalRegistration(\n    $shortName: String!\n    $registrationId: String!\n  ) {\n    commitClinicalRegistration(\n      shortName: $shortName\n      registrationId: $registrationId\n    )\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query GetRegistration($shortName: String!) {\n    clinicalRegistration(shortName: $shortName) {\n      id\n      programShortName\n      creator\n      fileName\n      createdAt\n      records {\n        row\n        fields {\n          name\n          value\n        }\n      }\n      errors {\n        type\n        message\n        row\n        field\n        value\n        sampleId\n        donorId\n        specimenId\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n      newDonors {\n        count\n        rows\n      }\n      newSpecimens {\n        count\n        rows\n      }\n      newSamples {\n        count\n        rows\n      }\n      alreadyRegistered {\n        count\n        rows\n      }\n    }\n  }    \n",
): (typeof documents)["\n  query GetRegistration($shortName: String!) {\n    clinicalRegistration(shortName: $shortName) {\n      id\n      programShortName\n      creator\n      fileName\n      createdAt\n      records {\n        row\n        fields {\n          name\n          value\n        }\n      }\n      errors {\n        type\n        message\n        row\n        field\n        value\n        sampleId\n        donorId\n        specimenId\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n      newDonors {\n        count\n        rows\n      }\n      newSpecimens {\n        count\n        rows\n      }\n      newSamples {\n        count\n        rows\n      }\n      alreadyRegistered {\n        count\n        rows\n      }\n    }\n  }    \n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n\tquery ProgramsList {\n\t\tprograms {\n\t\t\tshortName\n\t\t\tname\n\t\t\tcancerTypes\n\t\t\tcountries\n\t\t\tmembershipType\n\t\t\tgenomicDonors\n\t\t\tsubmittedDonors\n\t\t\tcommitmentDonors\n\t\t\tusers {\n\t\t\t\temail\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t\trole\n\t\t\t}\n\t\t}\n\t}\n",
): (typeof documents)["\n\tquery ProgramsList {\n\t\tprograms {\n\t\t\tshortName\n\t\t\tname\n\t\t\tcancerTypes\n\t\t\tcountries\n\t\t\tmembershipType\n\t\t\tgenomicDonors\n\t\t\tsubmittedDonors\n\t\t\tcommitmentDonors\n\t\t\tusers {\n\t\t\t\temail\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t\trole\n\t\t\t}\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n\tquery SideMenu {\n\t\tprograms {\n\t\t\tshortName\n\t\t}\n\t}\n",
): (typeof documents)["\n\tquery SideMenu {\n\t\tprograms {\n\t\t\tshortName\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n\tmutation UploadRegistration($shortName: String!, $registrationFile: Upload!) {\n\t\tuploadClinicalRegistration(shortName: $shortName, registrationFile: $registrationFile) {\n\t\t\tid\n      programShortName\n      creator\n      fileName\n      createdAt\n      records {\n        row\n        fields {\n          name\n          value\n        }\n      }\n      errors {\n        type\n        message\n        row\n        field\n        value\n        sampleId\n        donorId\n        specimenId\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n      newDonors {\n        count\n        rows\n      }\n      newSpecimens {\n        count\n        rows\n      }\n      newSamples {\n        count\n        rows\n      }\n      alreadyRegistered {\n        count\n        rows\n      }\n\t\t}\n\t}\n",
): (typeof documents)["\n\tmutation UploadRegistration($shortName: String!, $registrationFile: Upload!) {\n\t\tuploadClinicalRegistration(shortName: $shortName, registrationFile: $registrationFile) {\n\t\t\tid\n      programShortName\n      creator\n      fileName\n      createdAt\n      records {\n        row\n        fields {\n          name\n          value\n        }\n      }\n      errors {\n        type\n        message\n        row\n        field\n        value\n        sampleId\n        donorId\n        specimenId\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n      newDonors {\n        count\n        rows\n      }\n      newSpecimens {\n        count\n        rows\n      }\n      newSamples {\n        count\n        rows\n      }\n      alreadyRegistered {\n        count\n        rows\n      }\n\t\t}\n\t}\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
