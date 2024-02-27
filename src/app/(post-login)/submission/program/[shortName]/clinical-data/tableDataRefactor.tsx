/**
 * Reduce errors across all records into an object detailing:
 * - which fields have an error, the error description and how many rows are affected
 * example: if there are 7 records with fields of "cancer_type_code" that have the error MISSING_REQUIRED_FIELD
 * return: something like {affectedfields: 7, error_field: cancer_type_code, error_message: "cancer_type_code is a required field"}
 **/

export const formatTableErrors = ({ clinicalErrors, aliasedEntityName }) => {
	const tableErrorGroups = [];
	// {
	// 	"donorId": 262500,
	// 	"submitterDonorId": "Pat-1",
	// 	"errors": [
	// 			{
	// 					"errorType": "INVALID_BY_SCRIPT",
	// 					"fieldName": "lymph_nodes_examined_method",
	// 					"index": 0,
	// 					"info": {
	// 							"value": null,
	// 							"__typename": "ClinicalErrorInfo"
	// 					},
	// 					"message": "The 'lymph_nodes_examined_method' field must be submitted if the 'lymph_nodes_examined_status' field is 'Yes'",
	// 					"entityName": "primary_diagnosis",
	// 					"__typename": "ClinicalErrorRecord"
	// 			}]}
	// [{donorId..., errors: [{....all primary diag}]},{donorId..., errors: [{....all donor}]}] etc
	// no need to loop over every single error because they are grouped already
	clinicalErrors.forEach((donor) => {
		const relatedErrors = donor.errors.filter((error) => error.entityName === aliasedEntityName);
		console.log('realted', relatedErrors);
		relatedErrors.forEach((error) => {
			const { donorId } = donor;
			const { errorType, message, fieldName } = error;
			const relatedErrorGroup = tableErrorGroups.find(
				(tableErrorGroup) =>
					tableErrorGroup[0].errorType === errorType &&
					tableErrorGroup[0].message === message &&
					tableErrorGroup[0].fieldName === fieldName,
			);
			const tableError = { ...error, donorId };

			if (!relatedErrorGroup) {
				tableErrorGroups.push([tableError]);
			} else {
				relatedErrorGroup.push(tableError);
			}
		});
	});

	console.log('table error groups', tableErrorGroups);

	const tableErrors = tableErrorGroups.map((errorGroup) => {
		// Counts Number of Records affected for each Error Object
		const { fieldName, entityName, message, errorType } = errorGroup[0];

		const errorMessage =
			errorType === 'UNRECOGNIZED_FIELD'
				? `${fieldName} is not a field within the latest dictionary. Please remove this from the ${entityName}.tsv file before submitting.`
				: message;

		const entries = errorGroup.length;

		return {
			entries,
			fieldName,
			entityName,
			errorMessage,
		};
	});

	const totalErrorsAmount = tableErrors.reduce(
		(errorCount, errorGroup) => errorCount + errorGroup.entries,
		0,
	);

	return { tableErrors, totalErrorsAmount };
};

//
