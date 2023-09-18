import { ClinicalSubmissionQuery } from "@/__generated__/graphql";

export type ClinicalSubmission = ClinicalSubmissionQuery["clinicalSubmissions"];

export type ClinicalSubmissionState =
  ClinicalSubmissionQuery["clinicalSubmissions"]["state"];

// because gqlClinicalEntityToClinicalSubmissionEntityFile diverts from the gql object
export type ClinicalSubmissionEntity =
  ClinicalSubmissionQuery["clinicalSubmissions"]["clinicalEntities"][0] & {
    fileName: string;
    batchName?: string;
    displayName: string;
    recordsCount?: number;
    status: "UPDATE" | "SUCCESS" | "ERROR" | "SUCCESS" | "WARNING" | "NONE";
  };

export type ClinicalEntities = Array<ClinicalSubmissionEntity>;
