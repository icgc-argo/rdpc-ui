/*
 * Copyright (c) 2023 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
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
      createdAt: gqlFile.createdAt || "",
      creator: gqlFile.creator || "",
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
