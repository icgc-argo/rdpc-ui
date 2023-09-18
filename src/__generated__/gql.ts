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
  "\n  mutation ClearSubmission(\n    $programShortName: String!\n    $submissionVersion: String!\n    $fileType: String\n  ) {\n    clearClinicalSubmission(\n      programShortName: $programShortName\n      version: $submissionVersion\n      fileType: $fileType\n    ) {\n      id\n    }\n  }\n":
    types.ClearSubmissionDocument,
  "\n  query ClinicalSchemaVersion {\n    clinicalSubmissionSchemaVersion\n  }\n":
    types.ClinicalSchemaVersionDocument,
  "\n\tquery ClinicalSchemaVersion {\n\t\tclinicalSubmissionSchemaVersion\n\t}\n":
    types.ClinicalSchemaVersionDocument,
  "\n  fragment ClinicalSubmissionFragment on ClinicalSubmissionData {\n    programShortName # this is the ID\n    state\n    version\n    updatedAt\n    updatedBy\n    clinicalEntities {\n      clinicalType\n      batchName\n      creator\n      createdAt\n      stats {\n        noUpdate\n        new\n        updated\n        errorsFound\n      }\n      records {\n        row\n        fields {\n          name\n          value\n        }\n      }\n      dataUpdates {\n        row\n        field\n        newValue\n        oldValue\n        donorId\n      }\n      dataWarnings {\n        message\n        row\n        field\n        value\n        donorId\n      }\n      dataErrors {\n        message\n        row\n        field\n        value\n        donorId\n      }\n      schemaErrors {\n        message\n        row\n        field\n        value\n        donorId\n      }\n    }\n    fileErrors {\n      message\n      fileNames\n      code\n    }\n  }\n":
    types.ClinicalSubmissionFragmentFragmentDoc,
  "\n  query ClinicalSubmission($shortName: String!) {\n    clinicalSubmissions(programShortName: $shortName) {\n      programShortName\n      state\n      version\n      updatedAt\n      updatedBy\n      clinicalEntities {\n        clinicalType\n        batchName\n        creator\n        createdAt\n        stats {\n          noUpdate\n          new\n          updated\n          errorsFound\n        }\n        records {\n          row\n          fields {\n            name\n            value\n          }\n        }\n        dataUpdates {\n          row\n          field\n          newValue\n          oldValue\n          donorId\n        }\n        dataWarnings {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        dataErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        schemaErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n    }\n  }\n":
    types.ClinicalSubmissionDocument,
  "\n  query ClinicalSubmissionSystemDisabled {\n    clinicalSubmissionSystemDisabled\n  }\n":
    types.ClinicalSubmissionSystemDisabledDocument,
  "\n  mutation CommitClinicalRegistration(\n    $shortName: String!\n    $registrationId: String!\n  ) {\n    commitClinicalRegistration(\n      shortName: $shortName\n      registrationId: $registrationId\n    )\n  }\n":
    types.CommitClinicalRegistrationDocument,
  "\n  query GetRegistration($shortName: String!) {\n    clinicalRegistration(shortName: $shortName) {\n      id\n      programShortName\n      creator\n      fileName\n      createdAt\n      records {\n        row\n        fields {\n          name\n          value\n        }\n      }\n      errors {\n        type\n        message\n        row\n        field\n        value\n        sampleId\n        donorId\n        specimenId\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n      newDonors {\n        count\n        rows\n      }\n      newSpecimens {\n        count\n        rows\n      }\n      newSamples {\n        count\n        rows\n      }\n      alreadyRegistered {\n        count\n        rows\n      }\n    }\n  }\n":
    types.GetRegistrationDocument,
  "\n\tquery ProgramsList {\n\t\tprograms {\n\t\t\tshortName\n\t\t\tname\n\t\t\tcancerTypes\n\t\t\tcountries\n\t\t\tmembershipType\n\t\t\tgenomicDonors\n\t\t\tsubmittedDonors\n\t\t\tcommitmentDonors\n\t\t\tusers {\n\t\t\t\temail\n\t\t\t\tfirstName\n\t\t\t\tlastName\n\t\t\t\trole\n\t\t\t}\n\t\t}\n\t}\n":
    types.ProgramsListDocument,
  "\n  fragment Registration on ClinicalRegistrationData {\n    id\n    programShortName\n    creator\n    fileName\n    createdAt\n    records {\n      row\n      fields {\n        name\n        value\n      }\n    }\n    errors {\n      type\n      message\n      row\n      field\n      value\n      sampleId\n      donorId\n      specimenId\n    }\n    fileErrors {\n      message\n      fileNames\n      code\n    }\n    newDonors {\n      count\n      rows\n    }\n    newSpecimens {\n      count\n      rows\n    }\n    newSamples {\n      count\n      rows\n    }\n    alreadyRegistered {\n      count\n      rows\n    }\n  }\n":
    types.RegistrationFragmentDoc,
  "\n\tquery SideMenu($shortName: String!) {\n\t\tprograms {\n\t\t\tshortName\n\t\t}\n    clinicalRegistration(shortName: $shortName) {\n      programShortName\n      fileErrors {\n        message\n        code\n      }\n      fileName\n      errors {\n        type\n      }\n\t\t}\n\t}\n":
    types.SideMenuDocument,
  "\n  mutation UploadRegistration($shortName: String!, $registrationFile: Upload!) {\n    uploadClinicalRegistration(\n      shortName: $shortName\n      registrationFile: $registrationFile\n    ) {\n      id\n    programShortName\n    creator\n    fileName\n    createdAt\n    records {\n      row\n      fields {\n        name\n        value\n      }\n    }\n    errors {\n      type\n      message\n      row\n      field\n      value\n      sampleId\n      donorId\n      specimenId\n    }\n    fileErrors {\n      message\n      fileNames\n      code\n    }\n    newDonors {\n      count\n      rows\n    }\n    newSpecimens {\n      count\n      rows\n    }\n    newSamples {\n      count\n      rows\n    }\n    alreadyRegistered {\n      count\n      rows\n    }\n    }\n  }\n":
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
  source: "\n  mutation ClearSubmission(\n    $programShortName: String!\n    $submissionVersion: String!\n    $fileType: String\n  ) {\n    clearClinicalSubmission(\n      programShortName: $programShortName\n      version: $submissionVersion\n      fileType: $fileType\n    ) {\n      id\n    }\n  }\n",
): (typeof documents)["\n  mutation ClearSubmission(\n    $programShortName: String!\n    $submissionVersion: String!\n    $fileType: String\n  ) {\n    clearClinicalSubmission(\n      programShortName: $programShortName\n      version: $submissionVersion\n      fileType: $fileType\n    ) {\n      id\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query ClinicalSchemaVersion {\n    clinicalSubmissionSchemaVersion\n  }\n",
): (typeof documents)["\n  query ClinicalSchemaVersion {\n    clinicalSubmissionSchemaVersion\n  }\n"];
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
  source: "\n  fragment ClinicalSubmissionFragment on ClinicalSubmissionData {\n    programShortName # this is the ID\n    state\n    version\n    updatedAt\n    updatedBy\n    clinicalEntities {\n      clinicalType\n      batchName\n      creator\n      createdAt\n      stats {\n        noUpdate\n        new\n        updated\n        errorsFound\n      }\n      records {\n        row\n        fields {\n          name\n          value\n        }\n      }\n      dataUpdates {\n        row\n        field\n        newValue\n        oldValue\n        donorId\n      }\n      dataWarnings {\n        message\n        row\n        field\n        value\n        donorId\n      }\n      dataErrors {\n        message\n        row\n        field\n        value\n        donorId\n      }\n      schemaErrors {\n        message\n        row\n        field\n        value\n        donorId\n      }\n    }\n    fileErrors {\n      message\n      fileNames\n      code\n    }\n  }\n",
): (typeof documents)["\n  fragment ClinicalSubmissionFragment on ClinicalSubmissionData {\n    programShortName # this is the ID\n    state\n    version\n    updatedAt\n    updatedBy\n    clinicalEntities {\n      clinicalType\n      batchName\n      creator\n      createdAt\n      stats {\n        noUpdate\n        new\n        updated\n        errorsFound\n      }\n      records {\n        row\n        fields {\n          name\n          value\n        }\n      }\n      dataUpdates {\n        row\n        field\n        newValue\n        oldValue\n        donorId\n      }\n      dataWarnings {\n        message\n        row\n        field\n        value\n        donorId\n      }\n      dataErrors {\n        message\n        row\n        field\n        value\n        donorId\n      }\n      schemaErrors {\n        message\n        row\n        field\n        value\n        donorId\n      }\n    }\n    fileErrors {\n      message\n      fileNames\n      code\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query ClinicalSubmission($shortName: String!) {\n    clinicalSubmissions(programShortName: $shortName) {\n      programShortName\n      state\n      version\n      updatedAt\n      updatedBy\n      clinicalEntities {\n        clinicalType\n        batchName\n        creator\n        createdAt\n        stats {\n          noUpdate\n          new\n          updated\n          errorsFound\n        }\n        records {\n          row\n          fields {\n            name\n            value\n          }\n        }\n        dataUpdates {\n          row\n          field\n          newValue\n          oldValue\n          donorId\n        }\n        dataWarnings {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        dataErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        schemaErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n    }\n  }\n",
): (typeof documents)["\n  query ClinicalSubmission($shortName: String!) {\n    clinicalSubmissions(programShortName: $shortName) {\n      programShortName\n      state\n      version\n      updatedAt\n      updatedBy\n      clinicalEntities {\n        clinicalType\n        batchName\n        creator\n        createdAt\n        stats {\n          noUpdate\n          new\n          updated\n          errorsFound\n        }\n        records {\n          row\n          fields {\n            name\n            value\n          }\n        }\n        dataUpdates {\n          row\n          field\n          newValue\n          oldValue\n          donorId\n        }\n        dataWarnings {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        dataErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        schemaErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query ClinicalSubmissionSystemDisabled {\n    clinicalSubmissionSystemDisabled\n  }\n",
): (typeof documents)["\n  query ClinicalSubmissionSystemDisabled {\n    clinicalSubmissionSystemDisabled\n  }\n"];
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
  source: "\n  query GetRegistration($shortName: String!) {\n    clinicalRegistration(shortName: $shortName) {\n      id\n      programShortName\n      creator\n      fileName\n      createdAt\n      records {\n        row\n        fields {\n          name\n          value\n        }\n      }\n      errors {\n        type\n        message\n        row\n        field\n        value\n        sampleId\n        donorId\n        specimenId\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n      newDonors {\n        count\n        rows\n      }\n      newSpecimens {\n        count\n        rows\n      }\n      newSamples {\n        count\n        rows\n      }\n      alreadyRegistered {\n        count\n        rows\n      }\n    }\n  }\n",
): (typeof documents)["\n  query GetRegistration($shortName: String!) {\n    clinicalRegistration(shortName: $shortName) {\n      id\n      programShortName\n      creator\n      fileName\n      createdAt\n      records {\n        row\n        fields {\n          name\n          value\n        }\n      }\n      errors {\n        type\n        message\n        row\n        field\n        value\n        sampleId\n        donorId\n        specimenId\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n      newDonors {\n        count\n        rows\n      }\n      newSpecimens {\n        count\n        rows\n      }\n      newSamples {\n        count\n        rows\n      }\n      alreadyRegistered {\n        count\n        rows\n      }\n    }\n  }\n"];
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
  source: "\n  fragment Registration on ClinicalRegistrationData {\n    id\n    programShortName\n    creator\n    fileName\n    createdAt\n    records {\n      row\n      fields {\n        name\n        value\n      }\n    }\n    errors {\n      type\n      message\n      row\n      field\n      value\n      sampleId\n      donorId\n      specimenId\n    }\n    fileErrors {\n      message\n      fileNames\n      code\n    }\n    newDonors {\n      count\n      rows\n    }\n    newSpecimens {\n      count\n      rows\n    }\n    newSamples {\n      count\n      rows\n    }\n    alreadyRegistered {\n      count\n      rows\n    }\n  }\n",
): (typeof documents)["\n  fragment Registration on ClinicalRegistrationData {\n    id\n    programShortName\n    creator\n    fileName\n    createdAt\n    records {\n      row\n      fields {\n        name\n        value\n      }\n    }\n    errors {\n      type\n      message\n      row\n      field\n      value\n      sampleId\n      donorId\n      specimenId\n    }\n    fileErrors {\n      message\n      fileNames\n      code\n    }\n    newDonors {\n      count\n      rows\n    }\n    newSpecimens {\n      count\n      rows\n    }\n    newSamples {\n      count\n      rows\n    }\n    alreadyRegistered {\n      count\n      rows\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n\tquery SideMenu($shortName: String!) {\n\t\tprograms {\n\t\t\tshortName\n\t\t}\n    clinicalRegistration(shortName: $shortName) {\n      programShortName\n      fileErrors {\n        message\n        code\n      }\n      fileName\n      errors {\n        type\n      }\n\t\t}\n\t}\n",
): (typeof documents)["\n\tquery SideMenu($shortName: String!) {\n\t\tprograms {\n\t\t\tshortName\n\t\t}\n    clinicalRegistration(shortName: $shortName) {\n      programShortName\n      fileErrors {\n        message\n        code\n      }\n      fileName\n      errors {\n        type\n      }\n\t\t}\n\t}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  mutation UploadRegistration($shortName: String!, $registrationFile: Upload!) {\n    uploadClinicalRegistration(\n      shortName: $shortName\n      registrationFile: $registrationFile\n    ) {\n      id\n    programShortName\n    creator\n    fileName\n    createdAt\n    records {\n      row\n      fields {\n        name\n        value\n      }\n    }\n    errors {\n      type\n      message\n      row\n      field\n      value\n      sampleId\n      donorId\n      specimenId\n    }\n    fileErrors {\n      message\n      fileNames\n      code\n    }\n    newDonors {\n      count\n      rows\n    }\n    newSpecimens {\n      count\n      rows\n    }\n    newSamples {\n      count\n      rows\n    }\n    alreadyRegistered {\n      count\n      rows\n    }\n    }\n  }\n",
): (typeof documents)["\n  mutation UploadRegistration($shortName: String!, $registrationFile: Upload!) {\n    uploadClinicalRegistration(\n      shortName: $shortName\n      registrationFile: $registrationFile\n    ) {\n      id\n    programShortName\n    creator\n    fileName\n    createdAt\n    records {\n      row\n      fields {\n        name\n        value\n      }\n    }\n    errors {\n      type\n      message\n      row\n      field\n      value\n      sampleId\n      donorId\n      specimenId\n    }\n    fileErrors {\n      message\n      fileNames\n      code\n    }\n    newDonors {\n      count\n      rows\n    }\n    newSpecimens {\n      count\n      rows\n    }\n    newSamples {\n      count\n      rows\n    }\n    alreadyRegistered {\n      count\n      rows\n    }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
