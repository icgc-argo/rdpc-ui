import { useQuery } from "@apollo/client";
import CLINICAL_SUBMISSION_SYSTEM_STATUS_QUERY from "../gql/CLINICAL_SUBMISSION_SYSTEM_STATUS";

export const useSubmissionSystemStatus = () => {
  const { data } = useQuery(CLINICAL_SUBMISSION_SYSTEM_STATUS_QUERY);

  return { isDisabled: !!data?.clinicalSubmissionSystemDisabled };
};
