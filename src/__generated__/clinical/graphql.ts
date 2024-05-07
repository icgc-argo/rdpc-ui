/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
	[_ in K]?: never;
};
export type Incremental<T> =
	| T
	| { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: { input: string; output: string };
	String: { input: string; output: string };
	Boolean: { input: boolean; output: boolean };
	Int: { input: number; output: number };
	Float: { input: number; output: number };
	DateTime: { input: any; output: any };
	SchemaList: { input: any; output: any };
	_Any: { input: any; output: any };
	_FieldSet: { input: any; output: any };
};

/** Collated Clinical Data Query Response */
export type ClinicalData = {
	__typename?: 'ClinicalData';
	clinicalEntities: Array<Maybe<ClinicalDataEntities>>;
	clinicalErrors: Array<Maybe<ClinicalErrors>>;
	completionStats?: Maybe<Array<Maybe<CompletionStats>>>;
	programShortName: Scalars['String']['output'];
};

/** Submitted Program Clinical Data arranged by Entity type */
export type ClinicalDataEntities = {
	__typename?: 'ClinicalDataEntities';
	completionStats?: Maybe<Array<Maybe<CompletionStats>>>;
	entityFields?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
	entityName: Scalars['String']['output'];
	records: Array<Maybe<Array<Maybe<ClinicalRecordField>>>>;
	totalDocs: Scalars['Int']['output'];
};

export type ClinicalEntityError = {
	donorId: Scalars['String']['output'];
	field: Scalars['String']['output'];
	message: Scalars['String']['output'];
	row: Scalars['Int']['output'];
	type: Scalars['String']['output'];
	value: Scalars['String']['output'];
};

export type ClinicalErrorInfo = {
	__typename?: 'ClinicalErrorInfo';
	message?: Maybe<Scalars['String']['output']>;
	value?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

/** Specific Error Field + Values */
export type ClinicalErrorRecord = {
	__typename?: 'ClinicalErrorRecord';
	entityName?: Maybe<Scalars['String']['output']>;
	errorType?: Maybe<Scalars['String']['output']>;
	fieldName?: Maybe<Scalars['String']['output']>;
	index?: Maybe<Scalars['Int']['output']>;
	info?: Maybe<ClinicalErrorInfo>;
	message?: Maybe<Scalars['String']['output']>;
};

/** Data Submission / Schema Errors for a given Donor */
export type ClinicalErrors = {
	__typename?: 'ClinicalErrors';
	donorId?: Maybe<Scalars['Int']['output']>;
	entityName?: Maybe<Scalars['String']['output']>;
	errors?: Maybe<Array<Maybe<ClinicalErrorRecord>>>;
	submitterDonorId?: Maybe<Scalars['String']['output']>;
};

/** All schemas below describe clinical errors */
export type ClinicalFileError = {
	__typename?: 'ClinicalFileError';
	code: Scalars['String']['output'];
	fileNames: Array<Maybe<Scalars['String']['output']>>;
	message: Scalars['String']['output'];
};

/** Query Variables for Pagination & Filtering */
export type ClinicalInput = {
	completionState?: InputMaybe<Scalars['String']['input']>;
	donorIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
	entityTypes?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
	page: Scalars['Int']['input'];
	pageSize: Scalars['Int']['input'];
	sort?: InputMaybe<Scalars['String']['input']>;
	submitterDonorIds?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};

/** Generic schema of clinical tsv records */
export type ClinicalRecord = {
	__typename?: 'ClinicalRecord';
	fields: Array<ClinicalRecordField>;
	row: Scalars['Int']['output'];
};

export type ClinicalRecordField = {
	__typename?: 'ClinicalRecordField';
	name: Scalars['String']['output'];
	value?: Maybe<Scalars['String']['output']>;
};

/**
 * It is possible for there to be no available ClinicalRegistrationData for a program,
 *   in this case the object will return with id and creator equal to null, and an empty records list.
 */
export type ClinicalRegistrationData = {
	__typename?: 'ClinicalRegistrationData';
	alreadyRegistered: ClinicalRegistrationStats;
	createdAt?: Maybe<Scalars['DateTime']['output']>;
	creator?: Maybe<Scalars['String']['output']>;
	errors: Array<Maybe<ClinicalRegistrationError>>;
	fileErrors?: Maybe<Array<Maybe<ClinicalFileError>>>;
	fileName?: Maybe<Scalars['String']['output']>;
	id?: Maybe<Scalars['ID']['output']>;
	newDonors: ClinicalRegistrationStats;
	newSamples: ClinicalRegistrationStats;
	newSpecimens: ClinicalRegistrationStats;
	programShortName?: Maybe<Scalars['ID']['output']>;
	records: Array<Maybe<ClinicalRecord>>;
};

export type ClinicalRegistrationError = ClinicalEntityError & {
	__typename?: 'ClinicalRegistrationError';
	donorId: Scalars['String']['output'];
	field: Scalars['String']['output'];
	message: Scalars['String']['output'];
	row: Scalars['Int']['output'];
	sampleId?: Maybe<Scalars['String']['output']>;
	specimenId?: Maybe<Scalars['String']['output']>;
	type: Scalars['String']['output'];
	value: Scalars['String']['output'];
};

export type ClinicalRegistrationStatValue = {
	__typename?: 'ClinicalRegistrationStatValue';
	name: Scalars['String']['output'];
	rows: Array<Maybe<Scalars['Int']['output']>>;
};

export type ClinicalRegistrationStats = {
	__typename?: 'ClinicalRegistrationStats';
	count: Scalars['Int']['output'];
	names: Array<Maybe<Scalars['String']['output']>>;
	rows: Array<Maybe<Scalars['Int']['output']>>;
	values: Array<Maybe<ClinicalRegistrationStatValue>>;
};

/** Clinical Data DonorId Search Query Response */
export type ClinicalSearchData = {
	__typename?: 'ClinicalSearchData';
	programShortName: Scalars['String']['output'];
	searchResults: Array<Maybe<ClinicalSearchResults>>;
	totalResults: Scalars['Int']['output'];
};

/** Clinical Data DonorId Search Result Record */
export type ClinicalSearchResults = {
	__typename?: 'ClinicalSearchResults';
	donorId: Scalars['Int']['output'];
	submitterDonorId?: Maybe<Scalars['String']['output']>;
};

/** Clinical Submission Data */
export type ClinicalSubmissionData = {
	__typename?: 'ClinicalSubmissionData';
	clinicalEntities: Array<Maybe<ClinicalSubmissionEntity>>;
	fileErrors?: Maybe<Array<Maybe<ClinicalFileError>>>;
	id?: Maybe<Scalars['ID']['output']>;
	programShortName?: Maybe<Scalars['ID']['output']>;
	state?: Maybe<SubmissionState>;
	updatedAt?: Maybe<Scalars['DateTime']['output']>;
	updatedBy?: Maybe<Scalars['String']['output']>;
	version?: Maybe<Scalars['String']['output']>;
};

export type ClinicalSubmissionDataError = ClinicalEntityError & {
	__typename?: 'ClinicalSubmissionDataError';
	donorId: Scalars['String']['output'];
	field: Scalars['String']['output'];
	message: Scalars['String']['output'];
	row: Scalars['Int']['output'];
	type: Scalars['String']['output'];
	value: Scalars['String']['output'];
};

export type ClinicalSubmissionEntity = {
	__typename?: 'ClinicalSubmissionEntity';
	batchName?: Maybe<Scalars['String']['output']>;
	clinicalType: Scalars['String']['output'];
	createdAt?: Maybe<Scalars['DateTime']['output']>;
	creator?: Maybe<Scalars['String']['output']>;
	dataErrors: Array<Maybe<ClinicalSubmissionDataError>>;
	dataUpdates: Array<Maybe<ClinicalSubmissionUpdate>>;
	dataWarnings: Array<Maybe<ClinicalSubmissionSchemaError>>;
	records: Array<Maybe<ClinicalRecord>>;
	schemaErrors: Array<Maybe<ClinicalSubmissionSchemaError>>;
	stats?: Maybe<ClinicalSubmissionStats>;
};

export type ClinicalSubmissionSchemaError = ClinicalEntityError & {
	__typename?: 'ClinicalSubmissionSchemaError';
	clinicalType: Scalars['String']['output'];
	donorId: Scalars['String']['output'];
	field: Scalars['String']['output'];
	message: Scalars['String']['output'];
	row: Scalars['Int']['output'];
	type: Scalars['String']['output'];
	value: Scalars['String']['output'];
};

/** Each field is an array of row index referenced in ClinicalSubmissionRecord */
export type ClinicalSubmissionStats = {
	__typename?: 'ClinicalSubmissionStats';
	errorsFound: Array<Maybe<Scalars['Int']['output']>>;
	new: Array<Maybe<Scalars['Int']['output']>>;
	noUpdate: Array<Maybe<Scalars['Int']['output']>>;
	updated: Array<Maybe<Scalars['Int']['output']>>;
};

export type ClinicalSubmissionUpdate = {
	__typename?: 'ClinicalSubmissionUpdate';
	donorId: Scalars['String']['output'];
	field: Scalars['String']['output'];
	newValue: Scalars['String']['output'];
	oldValue: Scalars['String']['output'];
	row: Scalars['Int']['output'];
};

/** Display Data For Core Completion Entities */
export type CompletionEntityData = {
	__typename?: 'CompletionEntityData';
	specimens?: Maybe<SpecimenCoreCompletion>;
};

/** Completion Data for a given Donor */
export type CompletionStats = {
	__typename?: 'CompletionStats';
	coreCompletion?: Maybe<CoreCompletionFields>;
	coreCompletionDate?: Maybe<Scalars['String']['output']>;
	coreCompletionPercentage?: Maybe<Scalars['Float']['output']>;
	donorId?: Maybe<Scalars['Int']['output']>;
	entityData?: Maybe<CompletionEntityData>;
	hasMissingEntityException?: Maybe<Scalars['Boolean']['output']>;
};

/** Specific Entity Completion Values */
export type CoreCompletionFields = {
	__typename?: 'CoreCompletionFields';
	donor: Scalars['Float']['output'];
	followUps: Scalars['Float']['output'];
	primaryDiagnosis: Scalars['Float']['output'];
	specimens: Scalars['Float']['output'];
	treatments: Scalars['Float']['output'];
};

export type Mutation = {
	__typename?: 'Mutation';
	/** Remove the Clinical Registration data currently uploaded and not committed */
	clearClinicalRegistration: Scalars['Boolean']['output'];
	/**
	 * Clear Clinical Submission
	 * fileType is optional, if it is not provided all fileTypes will be cleared. The values for fileType are the same as the file names from each template (ex. donor, specimen)
	 */
	clearClinicalSubmission: ClinicalSubmissionData;
	/**
	 * Complete registration of the currently uploaded Clinical Registration data
	 * On Success, returns a list of the new sample IDs that were committed
	 */
	commitClinicalRegistration: Array<Maybe<Scalars['String']['output']>>;
	/**
	 * - If there is update: makes a clinical submission ready for approval by a DCC member,
	 * returning submission data with updated state
	 * - If there is NO update: merges clinical data to system, returning an empty submission
	 */
	commitClinicalSubmission: ClinicalSubmissionData;
	/** Validate the uploaded clinical files */
	validateClinicalSubmission: ClinicalSubmissionData;
};

export type MutationClearClinicalRegistrationArgs = {
	registrationId: Scalars['String']['input'];
	shortName: Scalars['String']['input'];
};

export type MutationClearClinicalSubmissionArgs = {
	fileType?: InputMaybe<Scalars['String']['input']>;
	programShortName: Scalars['String']['input'];
	version: Scalars['String']['input'];
};

export type MutationCommitClinicalRegistrationArgs = {
	registrationId: Scalars['String']['input'];
	shortName: Scalars['String']['input'];
};

export type MutationCommitClinicalSubmissionArgs = {
	programShortName: Scalars['String']['input'];
	version: Scalars['String']['input'];
};

export type MutationValidateClinicalSubmissionArgs = {
	programShortName: Scalars['String']['input'];
	version: Scalars['String']['input'];
};

export type Query = {
	__typename?: 'Query';
	_service: _Service;
	/** Retrieve all stored Clinical Entity and Donor Completion data for a program */
	clinicalData: ClinicalData;
	/** Retrieve all stored Clinical Migration Errors for a program */
	clinicalErrors: Array<ClinicalErrors>;
	/** Retrieve current stored Clinical Registration data for a program */
	clinicalRegistration: ClinicalRegistrationData;
	/** Retrieve DonorIds + Submitter Donor Ids for given Clinical Entity and Program */
	clinicalSearchResults: ClinicalSearchData;
	/** Retrieve current stored Clinical Submission Data Dictionary Schema version */
	clinicalSubmissionSchemaVersion: Scalars['String']['output'];
	/** Retrieve current Clinical Submission disabled state for both sample_registration and clinical entity files */
	clinicalSubmissionSystemDisabled: Scalars['Boolean']['output'];
	/** Retrieve current stored Clinical Submission Types list */
	clinicalSubmissionTypesList: Array<Maybe<Scalars['SchemaList']['output']>>;
	/** Retrieve current stored Clinical Submission data for a program */
	clinicalSubmissions: ClinicalSubmissionData;
};

export type QueryClinicalDataArgs = {
	filters: ClinicalInput;
	programShortName: Scalars['String']['input'];
};

export type QueryClinicalErrorsArgs = {
	donorIds?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
	programShortName: Scalars['String']['input'];
};

export type QueryClinicalRegistrationArgs = {
	shortName: Scalars['String']['input'];
};

export type QueryClinicalSearchResultsArgs = {
	filters: ClinicalInput;
	programShortName: Scalars['String']['input'];
};

export type QueryClinicalSubmissionTypesListArgs = {
	includeFields?: InputMaybe<Scalars['String']['input']>;
};

export type QueryClinicalSubmissionsArgs = {
	programShortName: Scalars['String']['input'];
};

export type SpecimenCoreCompletion = {
	__typename?: 'SpecimenCoreCompletion';
	coreCompletionPercentage: Scalars['Float']['output'];
	normalRegistrations: Scalars['Float']['output'];
	normalSpecimensPercentage: Scalars['Float']['output'];
	normalSubmissions: Scalars['Float']['output'];
	tumourRegistrations: Scalars['Float']['output'];
	tumourSpecimensPercentage: Scalars['Float']['output'];
	tumourSubmissions: Scalars['Float']['output'];
};

export enum SubmissionState {
	Invalid = 'INVALID',
	InvalidByMigration = 'INVALID_BY_MIGRATION',
	Open = 'OPEN',
	PendingApproval = 'PENDING_APPROVAL',
	Valid = 'VALID',
}

export type _Service = {
	__typename?: '_Service';
	sdl?: Maybe<Scalars['String']['output']>;
};

export type ClearClinicalRegistrationMutationVariables = Exact<{
	shortName: Scalars['String']['input'];
	registrationId: Scalars['String']['input'];
}>;

export type ClearClinicalRegistrationMutation = {
	__typename?: 'Mutation';
	clearClinicalRegistration: boolean;
};

export type ClearSubmissionMutationVariables = Exact<{
	programShortName: Scalars['String']['input'];
	submissionVersion: Scalars['String']['input'];
	fileType?: InputMaybe<Scalars['String']['input']>;
}>;

export type ClearSubmissionMutation = {
	__typename?: 'Mutation';
	clearClinicalSubmission: {
		__typename?: 'ClinicalSubmissionData';
		programShortName?: string | null;
		state?: SubmissionState | null;
		version?: string | null;
		updatedAt?: any | null;
		updatedBy?: string | null;
		clinicalEntities: Array<{
			__typename?: 'ClinicalSubmissionEntity';
			clinicalType: string;
			batchName?: string | null;
			creator?: string | null;
			createdAt?: any | null;
			stats?: {
				__typename?: 'ClinicalSubmissionStats';
				noUpdate: Array<number | null>;
				new: Array<number | null>;
				updated: Array<number | null>;
				errorsFound: Array<number | null>;
			} | null;
			records: Array<{
				__typename?: 'ClinicalRecord';
				row: number;
				fields: Array<{ __typename?: 'ClinicalRecordField'; name: string; value?: string | null }>;
			} | null>;
			dataUpdates: Array<{
				__typename?: 'ClinicalSubmissionUpdate';
				row: number;
				field: string;
				newValue: string;
				oldValue: string;
				donorId: string;
			} | null>;
			dataWarnings: Array<{
				__typename?: 'ClinicalSubmissionSchemaError';
				message: string;
				row: number;
				field: string;
				value: string;
				donorId: string;
			} | null>;
			dataErrors: Array<{
				__typename?: 'ClinicalSubmissionDataError';
				message: string;
				row: number;
				field: string;
				value: string;
				donorId: string;
			} | null>;
			schemaErrors: Array<{
				__typename?: 'ClinicalSubmissionSchemaError';
				message: string;
				row: number;
				field: string;
				value: string;
				donorId: string;
			} | null>;
		} | null>;
		fileErrors?: Array<{
			__typename?: 'ClinicalFileError';
			message: string;
			fileNames: Array<string | null>;
			code: string;
		} | null> | null;
	};
};

export type ClinicalEntityDataQueryVariables = Exact<{
	programShortName: Scalars['String']['input'];
	filters: ClinicalInput;
}>;

export type ClinicalEntityDataQuery = {
	__typename?: 'Query';
	clinicalData: {
		__typename?: 'ClinicalData';
		programShortName: string;
		clinicalEntities: Array<{
			__typename?: 'ClinicalDataEntities';
			entityName: string;
			entityFields?: Array<string | null> | null;
			totalDocs: number;
			records: Array<Array<{
				__typename?: 'ClinicalRecordField';
				name: string;
				value?: string | null;
			} | null> | null>;
			completionStats?: Array<{
				__typename?: 'CompletionStats';
				hasMissingEntityException?: boolean | null;
				coreCompletionDate?: string | null;
				coreCompletionPercentage?: number | null;
				donorId?: number | null;
				coreCompletion?: {
					__typename?: 'CoreCompletionFields';
					donor: number;
					specimens: number;
					primaryDiagnosis: number;
					followUps: number;
					treatments: number;
				} | null;
				entityData?: {
					__typename?: 'CompletionEntityData';
					specimens?: {
						__typename?: 'SpecimenCoreCompletion';
						coreCompletionPercentage: number;
						normalSpecimensPercentage: number;
						tumourSpecimensPercentage: number;
						normalRegistrations: number;
						normalSubmissions: number;
						tumourRegistrations: number;
						tumourSubmissions: number;
					} | null;
				} | null;
			} | null> | null;
		} | null>;
		clinicalErrors: Array<{
			__typename?: 'ClinicalErrors';
			donorId?: number | null;
			submitterDonorId?: string | null;
			errors?: Array<{
				__typename?: 'ClinicalErrorRecord';
				errorType?: string | null;
				fieldName?: string | null;
				index?: number | null;
				message?: string | null;
				entityName?: string | null;
				info?: { __typename?: 'ClinicalErrorInfo'; value?: Array<string | null> | null } | null;
			} | null> | null;
		} | null>;
	};
};

export type ClinicalEntitySearchResultsQueryVariables = Exact<{
	programShortName: Scalars['String']['input'];
	filters: ClinicalInput;
}>;

export type ClinicalEntitySearchResultsQuery = {
	__typename?: 'Query';
	clinicalSearchResults: {
		__typename?: 'ClinicalSearchData';
		programShortName: string;
		totalResults: number;
		searchResults: Array<{
			__typename?: 'ClinicalSearchResults';
			donorId: number;
			submitterDonorId?: string | null;
		} | null>;
	};
};

export type ClinicalErrorDataQueryVariables = Exact<{
	programShortName: Scalars['String']['input'];
	filters: ClinicalInput;
}>;

export type ClinicalErrorDataQuery = {
	__typename?: 'Query';
	clinicalData: {
		__typename?: 'ClinicalData';
		programShortName: string;
		clinicalErrors: Array<{
			__typename?: 'ClinicalErrors';
			donorId?: number | null;
			submitterDonorId?: string | null;
			errors?: Array<{
				__typename?: 'ClinicalErrorRecord';
				errorType?: string | null;
				fieldName?: string | null;
				index?: number | null;
				message?: string | null;
				entityName?: string | null;
				info?: { __typename?: 'ClinicalErrorInfo'; value?: Array<string | null> | null } | null;
			} | null> | null;
		} | null>;
	};
};

export type ClinicalSchemaVersionQueryVariables = Exact<{ [key: string]: never }>;

export type ClinicalSchemaVersionQuery = {
	__typename?: 'Query';
	clinicalSubmissionSchemaVersion: string;
};

export type ClinicalSubmissionFragmentFragment = {
	__typename?: 'ClinicalSubmissionData';
	programShortName?: string | null;
	state?: SubmissionState | null;
	version?: string | null;
	updatedAt?: any | null;
	updatedBy?: string | null;
	clinicalEntities: Array<{
		__typename?: 'ClinicalSubmissionEntity';
		clinicalType: string;
		batchName?: string | null;
		creator?: string | null;
		createdAt?: any | null;
		stats?: {
			__typename?: 'ClinicalSubmissionStats';
			noUpdate: Array<number | null>;
			new: Array<number | null>;
			updated: Array<number | null>;
			errorsFound: Array<number | null>;
		} | null;
		records: Array<{
			__typename?: 'ClinicalRecord';
			row: number;
			fields: Array<{ __typename?: 'ClinicalRecordField'; name: string; value?: string | null }>;
		} | null>;
		dataUpdates: Array<{
			__typename?: 'ClinicalSubmissionUpdate';
			row: number;
			field: string;
			newValue: string;
			oldValue: string;
			donorId: string;
		} | null>;
		dataWarnings: Array<{
			__typename?: 'ClinicalSubmissionSchemaError';
			message: string;
			row: number;
			field: string;
			value: string;
			donorId: string;
		} | null>;
		dataErrors: Array<{
			__typename?: 'ClinicalSubmissionDataError';
			message: string;
			row: number;
			field: string;
			value: string;
			donorId: string;
		} | null>;
		schemaErrors: Array<{
			__typename?: 'ClinicalSubmissionSchemaError';
			message: string;
			row: number;
			field: string;
			value: string;
			donorId: string;
		} | null>;
	} | null>;
	fileErrors?: Array<{
		__typename?: 'ClinicalFileError';
		message: string;
		fileNames: Array<string | null>;
		code: string;
	} | null> | null;
} & { ' $fragmentName'?: 'ClinicalSubmissionFragmentFragment' };

export type ClinicalSubmissionQueryVariables = Exact<{
	programShortName: Scalars['String']['input'];
}>;

export type ClinicalSubmissionQuery = {
	__typename?: 'Query';
	clinicalSubmissions: {
		__typename?: 'ClinicalSubmissionData';
		programShortName?: string | null;
		state?: SubmissionState | null;
		version?: string | null;
		updatedAt?: any | null;
		updatedBy?: string | null;
		clinicalEntities: Array<{
			__typename?: 'ClinicalSubmissionEntity';
			clinicalType: string;
			batchName?: string | null;
			creator?: string | null;
			createdAt?: any | null;
			stats?: {
				__typename?: 'ClinicalSubmissionStats';
				noUpdate: Array<number | null>;
				new: Array<number | null>;
				updated: Array<number | null>;
				errorsFound: Array<number | null>;
			} | null;
			records: Array<{
				__typename?: 'ClinicalRecord';
				row: number;
				fields: Array<{ __typename?: 'ClinicalRecordField'; name: string; value?: string | null }>;
			} | null>;
			dataUpdates: Array<{
				__typename?: 'ClinicalSubmissionUpdate';
				row: number;
				field: string;
				newValue: string;
				oldValue: string;
				donorId: string;
			} | null>;
			dataWarnings: Array<{
				__typename?: 'ClinicalSubmissionSchemaError';
				message: string;
				row: number;
				field: string;
				value: string;
				donorId: string;
			} | null>;
			dataErrors: Array<{
				__typename?: 'ClinicalSubmissionDataError';
				message: string;
				row: number;
				field: string;
				value: string;
				donorId: string;
			} | null>;
			schemaErrors: Array<{
				__typename?: 'ClinicalSubmissionSchemaError';
				message: string;
				row: number;
				field: string;
				value: string;
				donorId: string;
			} | null>;
		} | null>;
		fileErrors?: Array<{
			__typename?: 'ClinicalFileError';
			message: string;
			fileNames: Array<string | null>;
			code: string;
		} | null> | null;
	};
};

export type ClinicalSubmissionSystemDisabledQueryVariables = Exact<{ [key: string]: never }>;

export type ClinicalSubmissionSystemDisabledQuery = {
	__typename?: 'Query';
	clinicalSubmissionSystemDisabled: boolean;
};

export type CommitClinicalRegistrationMutationVariables = Exact<{
	shortName: Scalars['String']['input'];
	registrationId: Scalars['String']['input'];
}>;

export type CommitClinicalRegistrationMutation = {
	__typename?: 'Mutation';
	commitClinicalRegistration: Array<string | null>;
};

export type GetRegistrationQueryVariables = Exact<{
	shortName: Scalars['String']['input'];
}>;

export type GetRegistrationQuery = {
	__typename?: 'Query';
	clinicalRegistration: {
		__typename?: 'ClinicalRegistrationData';
		id?: string | null;
		programShortName?: string | null;
		creator?: string | null;
		fileName?: string | null;
		createdAt?: any | null;
		records: Array<{
			__typename?: 'ClinicalRecord';
			row: number;
			fields: Array<{ __typename?: 'ClinicalRecordField'; name: string; value?: string | null }>;
		} | null>;
		errors: Array<{
			__typename?: 'ClinicalRegistrationError';
			type: string;
			message: string;
			row: number;
			field: string;
			value: string;
			sampleId?: string | null;
			donorId: string;
			specimenId?: string | null;
		} | null>;
		fileErrors?: Array<{
			__typename?: 'ClinicalFileError';
			message: string;
			fileNames: Array<string | null>;
			code: string;
		} | null> | null;
		newDonors: {
			__typename?: 'ClinicalRegistrationStats';
			count: number;
			rows: Array<number | null>;
		};
		newSpecimens: {
			__typename?: 'ClinicalRegistrationStats';
			count: number;
			rows: Array<number | null>;
		};
		newSamples: {
			__typename?: 'ClinicalRegistrationStats';
			count: number;
			rows: Array<number | null>;
		};
		alreadyRegistered: {
			__typename?: 'ClinicalRegistrationStats';
			count: number;
			rows: Array<number | null>;
		};
	};
};

export type RegistrationFragment = {
	__typename?: 'ClinicalRegistrationData';
	id?: string | null;
	programShortName?: string | null;
	creator?: string | null;
	fileName?: string | null;
	createdAt?: any | null;
	records: Array<{
		__typename?: 'ClinicalRecord';
		row: number;
		fields: Array<{ __typename?: 'ClinicalRecordField'; name: string; value?: string | null }>;
	} | null>;
	errors: Array<{
		__typename?: 'ClinicalRegistrationError';
		type: string;
		message: string;
		row: number;
		field: string;
		value: string;
		sampleId?: string | null;
		donorId: string;
		specimenId?: string | null;
	} | null>;
	fileErrors?: Array<{
		__typename?: 'ClinicalFileError';
		message: string;
		fileNames: Array<string | null>;
		code: string;
	} | null> | null;
	newDonors: {
		__typename?: 'ClinicalRegistrationStats';
		count: number;
		rows: Array<number | null>;
	};
	newSpecimens: {
		__typename?: 'ClinicalRegistrationStats';
		count: number;
		rows: Array<number | null>;
	};
	newSamples: {
		__typename?: 'ClinicalRegistrationStats';
		count: number;
		rows: Array<number | null>;
	};
	alreadyRegistered: {
		__typename?: 'ClinicalRegistrationStats';
		count: number;
		rows: Array<number | null>;
	};
} & { ' $fragmentName'?: 'RegistrationFragment' };

export type SideMenuProgramStatusQueryVariables = Exact<{
	activeProgramName: Scalars['String']['input'];
	filters: ClinicalInput;
}>;

export type SideMenuProgramStatusQuery = {
	__typename?: 'Query';
	clinicalRegistration: {
		__typename?: 'ClinicalRegistrationData';
		programShortName?: string | null;
		fileName?: string | null;
		fileErrors?: Array<{
			__typename?: 'ClinicalFileError';
			message: string;
			code: string;
		} | null> | null;
		errors: Array<{ __typename?: 'ClinicalRegistrationError'; type: string } | null>;
	};
	clinicalSubmissions: {
		__typename?: 'ClinicalSubmissionData';
		programShortName?: string | null;
		state?: SubmissionState | null;
		clinicalEntities: Array<{
			__typename?: 'ClinicalSubmissionEntity';
			schemaErrors: Array<{ __typename?: 'ClinicalSubmissionSchemaError'; row: number } | null>;
		} | null>;
	};
	clinicalData: {
		__typename?: 'ClinicalData';
		programShortName: string;
		clinicalEntities: Array<{ __typename?: 'ClinicalDataEntities'; entityName: string } | null>;
		clinicalErrors: Array<{
			__typename?: 'ClinicalErrors';
			errors?: Array<{
				__typename?: 'ClinicalErrorRecord';
				entityName?: string | null;
			} | null> | null;
		} | null>;
	};
};

export type SignOffSubmissionMutationVariables = Exact<{
	programShortName: Scalars['String']['input'];
	submissionVersion: Scalars['String']['input'];
}>;

export type SignOffSubmissionMutation = {
	__typename?: 'Mutation';
	clinicalSubmissions: {
		__typename?: 'ClinicalSubmissionData';
		programShortName?: string | null;
		state?: SubmissionState | null;
		version?: string | null;
		updatedAt?: any | null;
		updatedBy?: string | null;
		clinicalEntities: Array<{
			__typename?: 'ClinicalSubmissionEntity';
			clinicalType: string;
			batchName?: string | null;
			creator?: string | null;
			createdAt?: any | null;
			stats?: {
				__typename?: 'ClinicalSubmissionStats';
				noUpdate: Array<number | null>;
				new: Array<number | null>;
				updated: Array<number | null>;
				errorsFound: Array<number | null>;
			} | null;
			records: Array<{
				__typename?: 'ClinicalRecord';
				row: number;
				fields: Array<{ __typename?: 'ClinicalRecordField'; name: string; value?: string | null }>;
			} | null>;
			dataUpdates: Array<{
				__typename?: 'ClinicalSubmissionUpdate';
				row: number;
				field: string;
				newValue: string;
				oldValue: string;
				donorId: string;
			} | null>;
			dataWarnings: Array<{
				__typename?: 'ClinicalSubmissionSchemaError';
				message: string;
				row: number;
				field: string;
				value: string;
				donorId: string;
			} | null>;
			dataErrors: Array<{
				__typename?: 'ClinicalSubmissionDataError';
				message: string;
				row: number;
				field: string;
				value: string;
				donorId: string;
			} | null>;
			schemaErrors: Array<{
				__typename?: 'ClinicalSubmissionSchemaError';
				message: string;
				row: number;
				field: string;
				value: string;
				donorId: string;
			} | null>;
		} | null>;
		fileErrors?: Array<{
			__typename?: 'ClinicalFileError';
			message: string;
			fileNames: Array<string | null>;
			code: string;
		} | null> | null;
	};
};

export type SubmittedDataSideMenuQueryVariables = Exact<{
	programShortName: Scalars['String']['input'];
	filters: ClinicalInput;
}>;

export type SubmittedDataSideMenuQuery = {
	__typename?: 'Query';
	clinicalData: {
		__typename?: 'ClinicalData';
		programShortName: string;
		clinicalEntities: Array<{ __typename?: 'ClinicalDataEntities'; entityName: string } | null>;
		clinicalErrors: Array<{
			__typename?: 'ClinicalErrors';
			errors?: Array<{
				__typename?: 'ClinicalErrorRecord';
				entityName?: string | null;
			} | null> | null;
		} | null>;
	};
};

export type ValidateSubmissionMutationVariables = Exact<{
	programShortName: Scalars['String']['input'];
	submissionVersion: Scalars['String']['input'];
}>;

export type ValidateSubmissionMutation = {
	__typename?: 'Mutation';
	validateClinicalSubmission: {
		__typename?: 'ClinicalSubmissionData';
		programShortName?: string | null;
		state?: SubmissionState | null;
		version?: string | null;
		updatedAt?: any | null;
		updatedBy?: string | null;
		clinicalEntities: Array<{
			__typename?: 'ClinicalSubmissionEntity';
			clinicalType: string;
			batchName?: string | null;
			creator?: string | null;
			createdAt?: any | null;
			stats?: {
				__typename?: 'ClinicalSubmissionStats';
				noUpdate: Array<number | null>;
				new: Array<number | null>;
				updated: Array<number | null>;
				errorsFound: Array<number | null>;
			} | null;
			records: Array<{
				__typename?: 'ClinicalRecord';
				row: number;
				fields: Array<{ __typename?: 'ClinicalRecordField'; name: string; value?: string | null }>;
			} | null>;
			dataUpdates: Array<{
				__typename?: 'ClinicalSubmissionUpdate';
				row: number;
				field: string;
				newValue: string;
				oldValue: string;
				donorId: string;
			} | null>;
			dataWarnings: Array<{
				__typename?: 'ClinicalSubmissionSchemaError';
				message: string;
				row: number;
				field: string;
				value: string;
				donorId: string;
			} | null>;
			dataErrors: Array<{
				__typename?: 'ClinicalSubmissionDataError';
				message: string;
				row: number;
				field: string;
				value: string;
				donorId: string;
			} | null>;
			schemaErrors: Array<{
				__typename?: 'ClinicalSubmissionSchemaError';
				message: string;
				row: number;
				field: string;
				value: string;
				donorId: string;
			} | null>;
		} | null>;
		fileErrors?: Array<{
			__typename?: 'ClinicalFileError';
			message: string;
			fileNames: Array<string | null>;
			code: string;
		} | null> | null;
	};
};

export const ClinicalSubmissionFragmentFragmentDoc = {
	kind: 'Document',
	definitions: [
		{
			kind: 'FragmentDefinition',
			name: { kind: 'Name', value: 'ClinicalSubmissionFragment' },
			typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'ClinicalSubmissionData' } },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'state' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'version' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'updatedBy' } },
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'clinicalEntities' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'clinicalType' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'batchName' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'creator' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'stats' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'noUpdate' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'new' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'updated' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'errorsFound' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'records' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'fields' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'dataUpdates' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'newValue' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'oldValue' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'dataWarnings' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'dataErrors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'schemaErrors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
										],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'fileErrors' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'fileNames' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'code' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ClinicalSubmissionFragmentFragment, unknown>;
export const RegistrationFragmentDoc = {
	kind: 'Document',
	definitions: [
		{
			kind: 'FragmentDefinition',
			name: { kind: 'Name', value: 'Registration' },
			typeCondition: {
				kind: 'NamedType',
				name: { kind: 'Name', value: 'ClinicalRegistrationData' },
			},
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'creator' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'fileName' } },
					{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'records' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'fields' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
										],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'errors' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'type' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'sampleId' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'specimenId' } },
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'fileErrors' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'fileNames' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'code' } },
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'newDonors' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'count' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'rows' } },
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'newSpecimens' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'count' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'rows' } },
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'newSamples' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'count' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'rows' } },
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'alreadyRegistered' },
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'count' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'rows' } },
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<RegistrationFragment, unknown>;
export const ClearClinicalRegistrationDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'ClearClinicalRegistration' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'shortName' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'registrationId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'clearClinicalRegistration' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'shortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'shortName' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'registrationId' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'registrationId' } },
							},
						],
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	ClearClinicalRegistrationMutation,
	ClearClinicalRegistrationMutationVariables
>;
export const ClearSubmissionDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'ClearSubmission' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'submissionVersion' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'fileType' } },
					type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'clearClinicalSubmission' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'programShortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'version' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'submissionVersion' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'fileType' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'fileType' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'state' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'version' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'updatedBy' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'clinicalEntities' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'clinicalType' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'batchName' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'creator' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'stats' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'noUpdate' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'new' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'updated' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'errorsFound' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'records' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'fields' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
																],
															},
														},
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dataUpdates' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'newValue' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'oldValue' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dataWarnings' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dataErrors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'schemaErrors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'fileErrors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'fileNames' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'code' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ClearSubmissionMutation, ClearSubmissionMutationVariables>;
export const ClinicalEntityDataDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'ClinicalEntityData' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'ClinicalInput' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'clinicalData' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'programShortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'filters' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'clinicalEntities' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'entityName' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'entityFields' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'totalDocs' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'records' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'completionStats' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'coreCompletion' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'donor' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'specimens' } },
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'primaryDiagnosis' },
																	},
																	{ kind: 'Field', name: { kind: 'Name', value: 'followUps' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'treatments' } },
																],
															},
														},
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'hasMissingEntityException' },
														},
														{ kind: 'Field', name: { kind: 'Name', value: 'coreCompletionDate' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'coreCompletionPercentage' },
														},
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'entityData' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{
																		kind: 'Field',
																		name: { kind: 'Name', value: 'specimens' },
																		selectionSet: {
																			kind: 'SelectionSet',
																			selections: [
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'coreCompletionPercentage' },
																				},
																				{
																					kind: 'Field',
																					name: {
																						kind: 'Name',
																						value: 'normalSpecimensPercentage',
																					},
																				},
																				{
																					kind: 'Field',
																					name: {
																						kind: 'Name',
																						value: 'tumourSpecimensPercentage',
																					},
																				},
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'normalRegistrations' },
																				},
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'normalSubmissions' },
																				},
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'tumourRegistrations' },
																				},
																				{
																					kind: 'Field',
																					name: { kind: 'Name', value: 'tumourSubmissions' },
																				},
																			],
																		},
																	},
																],
															},
														},
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'clinicalErrors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'submitterDonorId' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'errors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'errorType' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'fieldName' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'index' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'info' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
																],
															},
														},
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'entityName' } },
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ClinicalEntityDataQuery, ClinicalEntityDataQueryVariables>;
export const ClinicalEntitySearchResultsDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'ClinicalEntitySearchResults' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'ClinicalInput' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'clinicalSearchResults' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'programShortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'filters' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'totalResults' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'searchResults' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'submitterDonorId' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	ClinicalEntitySearchResultsQuery,
	ClinicalEntitySearchResultsQueryVariables
>;
export const ClinicalErrorDataDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'ClinicalErrorData' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'ClinicalInput' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'clinicalData' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'programShortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'filters' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'clinicalErrors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'submitterDonorId' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'errors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'errorType' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'fieldName' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'index' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'info' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
																],
															},
														},
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'entityName' } },
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ClinicalErrorDataQuery, ClinicalErrorDataQueryVariables>;
export const ClinicalSchemaVersionDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'ClinicalSchemaVersion' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{ kind: 'Field', name: { kind: 'Name', value: 'clinicalSubmissionSchemaVersion' } },
				],
			},
		},
	],
} as unknown as DocumentNode<ClinicalSchemaVersionQuery, ClinicalSchemaVersionQueryVariables>;
export const ClinicalSubmissionDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'ClinicalSubmission' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'clinicalSubmissions' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'programShortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'state' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'version' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'updatedBy' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'clinicalEntities' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'clinicalType' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'batchName' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'creator' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'stats' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'noUpdate' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'new' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'updated' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'errorsFound' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'records' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'fields' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
																],
															},
														},
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dataUpdates' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'newValue' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'oldValue' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dataWarnings' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dataErrors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'schemaErrors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'fileErrors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'fileNames' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'code' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ClinicalSubmissionQuery, ClinicalSubmissionQueryVariables>;
export const ClinicalSubmissionSystemDisabledDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'ClinicalSubmissionSystemDisabled' },
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{ kind: 'Field', name: { kind: 'Name', value: 'clinicalSubmissionSystemDisabled' } },
				],
			},
		},
	],
} as unknown as DocumentNode<
	ClinicalSubmissionSystemDisabledQuery,
	ClinicalSubmissionSystemDisabledQueryVariables
>;
export const CommitClinicalRegistrationDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'CommitClinicalRegistration' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'shortName' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'registrationId' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'commitClinicalRegistration' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'shortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'shortName' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'registrationId' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'registrationId' } },
							},
						],
					},
				],
			},
		},
	],
} as unknown as DocumentNode<
	CommitClinicalRegistrationMutation,
	CommitClinicalRegistrationMutationVariables
>;
export const GetRegistrationDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'GetRegistration' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'shortName' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'clinicalRegistration' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'shortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'shortName' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'id' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'creator' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'fileName' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'records' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'fields' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'errors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'type' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'sampleId' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'specimenId' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'fileErrors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'fileNames' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'code' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'newDonors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'count' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'rows' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'newSpecimens' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'count' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'rows' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'newSamples' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'count' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'rows' } },
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'alreadyRegistered' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'count' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'rows' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<GetRegistrationQuery, GetRegistrationQueryVariables>;
export const SideMenuProgramStatusDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SideMenuProgramStatus' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'activeProgramName' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'ClinicalInput' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'clinicalRegistration' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'shortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'activeProgramName' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'fileErrors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'code' } },
										],
									},
								},
								{ kind: 'Field', name: { kind: 'Name', value: 'fileName' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'errors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'type' } }],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'clinicalSubmissions' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'programShortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'activeProgramName' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'state' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'clinicalEntities' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'schemaErrors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [{ kind: 'Field', name: { kind: 'Name', value: 'row' } }],
												},
											},
										],
									},
								},
							],
						},
					},
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'clinicalData' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'programShortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'activeProgramName' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'filters' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'clinicalEntities' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'entityName' } }],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'clinicalErrors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'errors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'entityName' } },
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<SideMenuProgramStatusQuery, SideMenuProgramStatusQueryVariables>;
export const SignOffSubmissionDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'SignOffSubmission' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'submissionVersion' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						alias: { kind: 'Name', value: 'clinicalSubmissions' },
						name: { kind: 'Name', value: 'commitClinicalSubmission' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'programShortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'version' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'submissionVersion' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'state' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'version' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'updatedBy' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'clinicalEntities' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'clinicalType' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'batchName' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'creator' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'stats' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'noUpdate' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'new' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'updated' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'errorsFound' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'records' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'fields' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
																],
															},
														},
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dataUpdates' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'newValue' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'oldValue' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dataWarnings' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dataErrors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'schemaErrors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'fileErrors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'fileNames' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'code' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<SignOffSubmissionMutation, SignOffSubmissionMutationVariables>;
export const SubmittedDataSideMenuDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'query',
			name: { kind: 'Name', value: 'SubmittedDataSideMenu' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'ClinicalInput' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'clinicalData' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'programShortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'filters' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'filters' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'clinicalEntities' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [{ kind: 'Field', name: { kind: 'Name', value: 'entityName' } }],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'clinicalErrors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'errors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'entityName' } },
													],
												},
											},
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<SubmittedDataSideMenuQuery, SubmittedDataSideMenuQueryVariables>;
export const ValidateSubmissionDocument = {
	kind: 'Document',
	definitions: [
		{
			kind: 'OperationDefinition',
			operation: 'mutation',
			name: { kind: 'Name', value: 'ValidateSubmission' },
			variableDefinitions: [
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
				{
					kind: 'VariableDefinition',
					variable: { kind: 'Variable', name: { kind: 'Name', value: 'submissionVersion' } },
					type: {
						kind: 'NonNullType',
						type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
					},
				},
			],
			selectionSet: {
				kind: 'SelectionSet',
				selections: [
					{
						kind: 'Field',
						name: { kind: 'Name', value: 'validateClinicalSubmission' },
						arguments: [
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'programShortName' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'programShortName' } },
							},
							{
								kind: 'Argument',
								name: { kind: 'Name', value: 'version' },
								value: { kind: 'Variable', name: { kind: 'Name', value: 'submissionVersion' } },
							},
						],
						selectionSet: {
							kind: 'SelectionSet',
							selections: [
								{ kind: 'Field', name: { kind: 'Name', value: 'programShortName' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'state' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'version' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'updatedAt' } },
								{ kind: 'Field', name: { kind: 'Name', value: 'updatedBy' } },
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'clinicalEntities' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'clinicalType' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'batchName' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'creator' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'stats' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'noUpdate' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'new' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'updated' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'errorsFound' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'records' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{
															kind: 'Field',
															name: { kind: 'Name', value: 'fields' },
															selectionSet: {
																kind: 'SelectionSet',
																selections: [
																	{ kind: 'Field', name: { kind: 'Name', value: 'name' } },
																	{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
																],
															},
														},
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dataUpdates' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'newValue' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'oldValue' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dataWarnings' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'dataErrors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
											{
												kind: 'Field',
												name: { kind: 'Name', value: 'schemaErrors' },
												selectionSet: {
													kind: 'SelectionSet',
													selections: [
														{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'row' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'field' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'value' } },
														{ kind: 'Field', name: { kind: 'Name', value: 'donorId' } },
													],
												},
											},
										],
									},
								},
								{
									kind: 'Field',
									name: { kind: 'Name', value: 'fileErrors' },
									selectionSet: {
										kind: 'SelectionSet',
										selections: [
											{ kind: 'Field', name: { kind: 'Name', value: 'message' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'fileNames' } },
											{ kind: 'Field', name: { kind: 'Name', value: 'code' } },
										],
									},
								},
							],
						},
					},
				],
			},
		},
	],
} as unknown as DocumentNode<ValidateSubmissionMutation, ValidateSubmissionMutationVariables>;
