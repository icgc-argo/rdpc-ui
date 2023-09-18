import { ClinicalSubmissionQuery } from "@/__generated__/graphql";
import { capitalize, map, orderBy } from "lodash";
import { ClinicalSubmissionEntity, ClinicalSubmissionState } from "./types";

const CLINICAL_FILE_ORDER = [
  "donor",
  "specimen",
  "primary_diagnosis",
  "treatment",
  "chemotherapy",
  "hormone_therapy",
  "immunotherapy",
  "radiation",
  "surgery",
  "follow_up",
  "family_history",
  "exposure",
  "comorbidity",
  "biomarker",
];

const gqlClinicalEntityToClinicalSubmissionEntityFile =
  (submissionState: ClinicalSubmissionState) =>
  // using "any" because we're data massaging the returned GQL, even though the final data types have genearted typings from gql endpoints
  // adding an additional GQLFile type as we have in the original code doesn't make sense
  (gqlFile: any): ClinicalSubmissionEntity => {
    const isSubmissionValidated =
      submissionState === "INVALID" ||
      submissionState === "VALID" ||
      submissionState === "PENDING_APPROVAL";
    const isPendingApproval = submissionState === "PENDING_APPROVAL";
    const stats = {
      errorsFound: [],
      new: [],
      noUpdate: [],
      updated: [],
      ...(gqlFile.stats || {}),
    };
    const hasSchemaError = !!gqlFile.schemaErrors.length;
    const hasDataError = !!gqlFile.dataErrors.length;
    const hasUpdate = !!stats.updated.length;
    return {
      stats,
      createdAt: gqlFile.createdAt,
      creator: gqlFile.creator,
      fileName: gqlFile.batchName,
      schemaErrors: gqlFile.schemaErrors,
      dataErrors: gqlFile.dataErrors,
      dataUpdates: gqlFile.dataUpdates,
      dataWarnings: gqlFile.dataWarnings,
      displayName: capitalize(
        (gqlFile.clinicalType || "").split("_").join(" "),
      ),
      clinicalType: gqlFile.clinicalType,
      records: gqlFile.records,
      recordsCount: gqlFile.records.length,
      status: isPendingApproval
        ? hasUpdate
          ? "UPDATE"
          : "SUCCESS"
        : hasSchemaError || hasDataError
        ? "ERROR"
        : gqlFile.records.length
        ? isSubmissionValidated
          ? "SUCCESS"
          : "WARNING"
        : "NONE",
    };
  };

export const getFileNavigatorFiles = (dataObj: ClinicalSubmissionQuery) =>
  map(
    orderBy(dataObj.clinicalSubmissions.clinicalEntities, (e) =>
      CLINICAL_FILE_ORDER.indexOf(e ? e.clinicalType : ""),
    ),
    gqlClinicalEntityToClinicalSubmissionEntityFile(
      dataObj.clinicalSubmissions.state,
    ),
  );
