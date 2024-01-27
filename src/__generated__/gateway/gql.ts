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
	'\n  mutation ApproveSubmission($programShortName: String!, $submissionVersion: String!) {\n    approveClinicalSubmission(programShortName: $programShortName, version: $submissionVersion)\n  }\n':
		types.ApproveSubmissionDocument,
	'\n\tquery DashboardSummary($programShortName: String!) {\n\t\tprogramDonorSummary(programShortName: $programShortName) {\n\t\t\tstats {\n\t\t\t\tregisteredDonorsCount\n\t\t\t\tpercentageCoreClinical\n\t\t\t\tpercentageTumourAndNormal\n\t\t\t\tdonorsProcessingMolecularDataCount\n\t\t\t\tfilesToQcCount\n\t\t\t\tdonorsWithReleasedFilesCount\n\t\t\t\tallFilesCount\n\t\t\t\tfullyReleasedDonorsCount\n\t\t\t\tpartiallyReleasedDonorsCount\n\t\t\t\tnoReleaseDonorsCount\n\t\t\t}\n\t\t}\n\t\tprogram(shortName: $programShortName) {\n\t\t\tcommitmentDonors\n\t\t\tshortName # this is the ID\n\t\t}\n\t}\n':
		types.DashboardSummaryDocument,
	'\n\tquery ProgramsList($dataCenter: String) {\n\t\tprograms(dataCenter: $dataCenter) {\n\t\t\tshortName\n\t\t\tname\n\t\t\tcancerTypes\n\t\t\tcountries\n\t\t\tdataCenter {\n\t\t\t\tshortName\n\t\t\t}\n\t\t\tmembershipType\n\t\t\tgenomicDonors\n\t\t\tsubmittedDonors\n\t\t\tcommitmentDonors\n\t\t}\n\t}\n':
		types.ProgramsListDocument,
	'\n\tquery ProgramDonorPublishedAnalysisByDateRange(\n\t\t$programShortName: String!\n\t\t$bucketCount: Int!\n\t\t$dateRangeFrom: DateTime!\n\t\t$dateRangeTo: DateTime!\n\t\t$donorFields: [DonorField]!\n\t) {\n\t\tprogramDonorPublishedAnalysisByDateRange(\n\t\t\tprogramShortName: $programShortName\n\t\t\tbucketCount: $bucketCount\n\t\t\tdateRangeFrom: $dateRangeFrom\n\t\t\tdateRangeTo: $dateRangeTo\n\t\t\tdonorFields: $donorFields\n\t\t) {\n\t\t\ttitle\n\t\t\tbuckets {\n\t\t\t\tdate\n\t\t\t\tdonors\n\t\t\t}\n\t\t}\n\t}\n':
		types.ProgramDonorPublishedAnalysisByDateRangeDocument,
	'\n  mutation ReopenSubmission(\n    $programShortName: String!\n    $submissionVersion: String!\n  ) {\n    clinicalSubmissions: reopenClinicalSubmission(\n      programShortName: $programShortName\n      version: $submissionVersion\n    ) {\n      programShortName # this is the ID\n      state\n      version\n      updatedAt\n      updatedBy\n      clinicalEntities {\n        clinicalType\n        batchName\n        creator\n        createdAt\n        stats {\n          noUpdate\n          new\n          updated\n          errorsFound\n        }\n        records {\n          row\n          fields {\n            name\n            value\n          }\n        }\n        dataUpdates {\n          row\n          field\n          newValue\n          oldValue\n          donorId\n        }\n        dataWarnings {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        dataErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        schemaErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n    }\n  }\n':
		types.ReopenSubmissionDocument,
	'\n\tquery SideMenu ($dataCenter: String) {\n\t\tprograms(dataCenter: $dataCenter) {\n\t\t\tshortName\n\t\t}\n  }\n':
		types.SideMenuDocument,
	'\n  mutation UploadClinicalSubmission($programShortName: String!, $files: [Upload!]) {\n    uploadClinicalSubmissions(\n      programShortName: $programShortName\n      clinicalFiles: $files\n    ) {\n      programShortName # this is the ID\n      state\n      version\n      updatedAt\n      updatedBy\n      clinicalEntities {\n        clinicalType\n        batchName\n        creator\n        createdAt\n        stats {\n          noUpdate\n          new\n          updated\n          errorsFound\n        }\n        records {\n          row\n          fields {\n            name\n            value\n          }\n        }\n        dataUpdates {\n          row\n          field\n          newValue\n          oldValue\n          donorId\n        }\n        dataWarnings {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        dataErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        schemaErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n    }\n  }\n':
		types.UploadClinicalSubmissionDocument,
	'\n  mutation UploadRegistration($shortName: String!, $registrationFile: Upload!) {\n    uploadClinicalRegistration(\n      shortName: $shortName\n      registrationFile: $registrationFile\n    ) {\n      id\n    programShortName\n    creator\n    fileName\n    createdAt\n    records {\n      row\n      fields {\n        name\n        value\n      }\n    }\n    errors {\n      type\n      message\n      row\n      field\n      value\n      sampleId\n      donorId\n      specimenId\n    }\n    fileErrors {\n      message\n      fileNames\n      code\n    }\n    newDonors {\n      count\n      rows\n    }\n    newSpecimens {\n      count\n      rows\n    }\n    newSamples {\n      count\n      rows\n    }\n    alreadyRegistered {\n      count\n      rows\n    }\n    }\n  }\n':
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
	source: '\n  mutation ApproveSubmission($programShortName: String!, $submissionVersion: String!) {\n    approveClinicalSubmission(programShortName: $programShortName, version: $submissionVersion)\n  }\n',
): (typeof documents)['\n  mutation ApproveSubmission($programShortName: String!, $submissionVersion: String!) {\n    approveClinicalSubmission(programShortName: $programShortName, version: $submissionVersion)\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
	source: '\n\tquery DashboardSummary($programShortName: String!) {\n\t\tprogramDonorSummary(programShortName: $programShortName) {\n\t\t\tstats {\n\t\t\t\tregisteredDonorsCount\n\t\t\t\tpercentageCoreClinical\n\t\t\t\tpercentageTumourAndNormal\n\t\t\t\tdonorsProcessingMolecularDataCount\n\t\t\t\tfilesToQcCount\n\t\t\t\tdonorsWithReleasedFilesCount\n\t\t\t\tallFilesCount\n\t\t\t\tfullyReleasedDonorsCount\n\t\t\t\tpartiallyReleasedDonorsCount\n\t\t\t\tnoReleaseDonorsCount\n\t\t\t}\n\t\t}\n\t\tprogram(shortName: $programShortName) {\n\t\t\tcommitmentDonors\n\t\t\tshortName # this is the ID\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery DashboardSummary($programShortName: String!) {\n\t\tprogramDonorSummary(programShortName: $programShortName) {\n\t\t\tstats {\n\t\t\t\tregisteredDonorsCount\n\t\t\t\tpercentageCoreClinical\n\t\t\t\tpercentageTumourAndNormal\n\t\t\t\tdonorsProcessingMolecularDataCount\n\t\t\t\tfilesToQcCount\n\t\t\t\tdonorsWithReleasedFilesCount\n\t\t\t\tallFilesCount\n\t\t\t\tfullyReleasedDonorsCount\n\t\t\t\tpartiallyReleasedDonorsCount\n\t\t\t\tnoReleaseDonorsCount\n\t\t\t}\n\t\t}\n\t\tprogram(shortName: $programShortName) {\n\t\t\tcommitmentDonors\n\t\t\tshortName # this is the ID\n\t\t}\n\t}\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
	source: '\n\tquery ProgramsList($dataCenter: String) {\n\t\tprograms(dataCenter: $dataCenter) {\n\t\t\tshortName\n\t\t\tname\n\t\t\tcancerTypes\n\t\t\tcountries\n\t\t\tdataCenter {\n\t\t\t\tshortName\n\t\t\t}\n\t\t\tmembershipType\n\t\t\tgenomicDonors\n\t\t\tsubmittedDonors\n\t\t\tcommitmentDonors\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery ProgramsList($dataCenter: String) {\n\t\tprograms(dataCenter: $dataCenter) {\n\t\t\tshortName\n\t\t\tname\n\t\t\tcancerTypes\n\t\t\tcountries\n\t\t\tdataCenter {\n\t\t\t\tshortName\n\t\t\t}\n\t\t\tmembershipType\n\t\t\tgenomicDonors\n\t\t\tsubmittedDonors\n\t\t\tcommitmentDonors\n\t\t}\n\t}\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
	source: '\n\tquery ProgramDonorPublishedAnalysisByDateRange(\n\t\t$programShortName: String!\n\t\t$bucketCount: Int!\n\t\t$dateRangeFrom: DateTime!\n\t\t$dateRangeTo: DateTime!\n\t\t$donorFields: [DonorField]!\n\t) {\n\t\tprogramDonorPublishedAnalysisByDateRange(\n\t\t\tprogramShortName: $programShortName\n\t\t\tbucketCount: $bucketCount\n\t\t\tdateRangeFrom: $dateRangeFrom\n\t\t\tdateRangeTo: $dateRangeTo\n\t\t\tdonorFields: $donorFields\n\t\t) {\n\t\t\ttitle\n\t\t\tbuckets {\n\t\t\t\tdate\n\t\t\t\tdonors\n\t\t\t}\n\t\t}\n\t}\n',
): (typeof documents)['\n\tquery ProgramDonorPublishedAnalysisByDateRange(\n\t\t$programShortName: String!\n\t\t$bucketCount: Int!\n\t\t$dateRangeFrom: DateTime!\n\t\t$dateRangeTo: DateTime!\n\t\t$donorFields: [DonorField]!\n\t) {\n\t\tprogramDonorPublishedAnalysisByDateRange(\n\t\t\tprogramShortName: $programShortName\n\t\t\tbucketCount: $bucketCount\n\t\t\tdateRangeFrom: $dateRangeFrom\n\t\t\tdateRangeTo: $dateRangeTo\n\t\t\tdonorFields: $donorFields\n\t\t) {\n\t\t\ttitle\n\t\t\tbuckets {\n\t\t\t\tdate\n\t\t\t\tdonors\n\t\t\t}\n\t\t}\n\t}\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
	source: '\n  mutation ReopenSubmission(\n    $programShortName: String!\n    $submissionVersion: String!\n  ) {\n    clinicalSubmissions: reopenClinicalSubmission(\n      programShortName: $programShortName\n      version: $submissionVersion\n    ) {\n      programShortName # this is the ID\n      state\n      version\n      updatedAt\n      updatedBy\n      clinicalEntities {\n        clinicalType\n        batchName\n        creator\n        createdAt\n        stats {\n          noUpdate\n          new\n          updated\n          errorsFound\n        }\n        records {\n          row\n          fields {\n            name\n            value\n          }\n        }\n        dataUpdates {\n          row\n          field\n          newValue\n          oldValue\n          donorId\n        }\n        dataWarnings {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        dataErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        schemaErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation ReopenSubmission(\n    $programShortName: String!\n    $submissionVersion: String!\n  ) {\n    clinicalSubmissions: reopenClinicalSubmission(\n      programShortName: $programShortName\n      version: $submissionVersion\n    ) {\n      programShortName # this is the ID\n      state\n      version\n      updatedAt\n      updatedBy\n      clinicalEntities {\n        clinicalType\n        batchName\n        creator\n        createdAt\n        stats {\n          noUpdate\n          new\n          updated\n          errorsFound\n        }\n        records {\n          row\n          fields {\n            name\n            value\n          }\n        }\n        dataUpdates {\n          row\n          field\n          newValue\n          oldValue\n          donorId\n        }\n        dataWarnings {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        dataErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        schemaErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
	source: '\n\tquery SideMenu ($dataCenter: String) {\n\t\tprograms(dataCenter: $dataCenter) {\n\t\t\tshortName\n\t\t}\n  }\n',
): (typeof documents)['\n\tquery SideMenu ($dataCenter: String) {\n\t\tprograms(dataCenter: $dataCenter) {\n\t\t\tshortName\n\t\t}\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
	source: '\n  mutation UploadClinicalSubmission($programShortName: String!, $files: [Upload!]) {\n    uploadClinicalSubmissions(\n      programShortName: $programShortName\n      clinicalFiles: $files\n    ) {\n      programShortName # this is the ID\n      state\n      version\n      updatedAt\n      updatedBy\n      clinicalEntities {\n        clinicalType\n        batchName\n        creator\n        createdAt\n        stats {\n          noUpdate\n          new\n          updated\n          errorsFound\n        }\n        records {\n          row\n          fields {\n            name\n            value\n          }\n        }\n        dataUpdates {\n          row\n          field\n          newValue\n          oldValue\n          donorId\n        }\n        dataWarnings {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        dataErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        schemaErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation UploadClinicalSubmission($programShortName: String!, $files: [Upload!]) {\n    uploadClinicalSubmissions(\n      programShortName: $programShortName\n      clinicalFiles: $files\n    ) {\n      programShortName # this is the ID\n      state\n      version\n      updatedAt\n      updatedBy\n      clinicalEntities {\n        clinicalType\n        batchName\n        creator\n        createdAt\n        stats {\n          noUpdate\n          new\n          updated\n          errorsFound\n        }\n        records {\n          row\n          fields {\n            name\n            value\n          }\n        }\n        dataUpdates {\n          row\n          field\n          newValue\n          oldValue\n          donorId\n        }\n        dataWarnings {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        dataErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n        schemaErrors {\n          message\n          row\n          field\n          value\n          donorId\n        }\n      }\n      fileErrors {\n        message\n        fileNames\n        code\n      }\n    }\n  }\n'];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
	source: '\n  mutation UploadRegistration($shortName: String!, $registrationFile: Upload!) {\n    uploadClinicalRegistration(\n      shortName: $shortName\n      registrationFile: $registrationFile\n    ) {\n      id\n    programShortName\n    creator\n    fileName\n    createdAt\n    records {\n      row\n      fields {\n        name\n        value\n      }\n    }\n    errors {\n      type\n      message\n      row\n      field\n      value\n      sampleId\n      donorId\n      specimenId\n    }\n    fileErrors {\n      message\n      fileNames\n      code\n    }\n    newDonors {\n      count\n      rows\n    }\n    newSpecimens {\n      count\n      rows\n    }\n    newSamples {\n      count\n      rows\n    }\n    alreadyRegistered {\n      count\n      rows\n    }\n    }\n  }\n',
): (typeof documents)['\n  mutation UploadRegistration($shortName: String!, $registrationFile: Upload!) {\n    uploadClinicalRegistration(\n      shortName: $shortName\n      registrationFile: $registrationFile\n    ) {\n      id\n    programShortName\n    creator\n    fileName\n    createdAt\n    records {\n      row\n      fields {\n        name\n        value\n      }\n    }\n    errors {\n      type\n      message\n      row\n      field\n      value\n      sampleId\n      donorId\n      specimenId\n    }\n    fileErrors {\n      message\n      fileNames\n      code\n    }\n    newDonors {\n      count\n      rows\n    }\n    newSpecimens {\n      count\n      rows\n    }\n    newSamples {\n      count\n      rows\n    }\n    alreadyRegistered {\n      count\n      rows\n    }\n    }\n  }\n'];

export function gql(source: string) {
	return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
	TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
