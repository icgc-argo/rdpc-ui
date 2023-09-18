import { ClinicalSubmissionQuery } from "@/__generated__/graphql";

export type ClinicalSubmission = ClinicalSubmissionQuery["clinicalSubmissions"];

export type ClinicalSubmissionState =
  ClinicalSubmissionQuery["clinicalSubmissions"]["state"];

export type ClinicalEntities =
  ClinicalSubmissionQuery["clinicalSubmissions"]["clinicalEntities"];
