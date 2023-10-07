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
import { notNull } from "@/global/utils";
import { capitalize, orderBy } from "lodash";
import { ClinicalSubmission, clinicalStatuses } from "./types";

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

// parse out nulls, undefined, provide sensible defaults so type checking isnt a scattered nightmare
export const parseGQLResp: (v: any) => ClinicalSubmission = (gqlData) => {
  const clinicalState = gqlData?.clinicalSubmissions.state;
  const clinicalVersion = gqlData?.clinicalSubmissions.version || "";

  const fileErrors = gqlData?.clinicalSubmissions.fileErrors;

  const isSubmissionValidated =
    clinicalState === "INVALID" ||
    clinicalState === "VALID" ||
    clinicalState === "PENDING_APPROVAL";

  const isPendingApproval = clinicalState === "PENDING_APPROVAL";

  const filteredEntities =
    gqlData?.clinicalSubmissions.clinicalEntities.filter(notNull) || [];
  const orderedEntities = orderBy(filteredEntities, (entity) =>
    CLINICAL_FILE_ORDER.indexOf(entity ? entity.clinicalType : ""),
  );
  const clinicalEntities = orderedEntities.map((entity) => {
    const stats = {
      errorsFound: [],
      new: [],
      noUpdate: [],
      updated: [],
      ...(entity.stats || {}),
    };

    const {
      createdAt,
      creator,
      batchName,
      schemaErrors,
      dataErrors,
      dataUpdates,
      dataWarnings,
      clinicalType,
      records,
    } = entity;

    const hasSchemaError = !!schemaErrors.length;
    const hasDataError = !!dataErrors.length;
    const hasUpdate = !!stats.updated.length;

    const displayName = capitalize((clinicalType || "").split("_").join(" "));

    const status = isPendingApproval
      ? hasUpdate
        ? clinicalStatuses.UPDATE
        : clinicalStatuses.SUCCESS
      : hasSchemaError || hasDataError
      ? clinicalStatuses.ERROR
      : records.length
      ? isSubmissionValidated
        ? clinicalStatuses.SUCCESS
        : clinicalStatuses.WARNING
      : clinicalStatuses.NONE;

    return {
      stats,
      createdAt: createdAt || "",
      creator: creator || "",
      fileName: batchName,
      schemaErrors,
      dataErrors,
      dataUpdates,
      dataWarnings,
      displayName,
      clinicalType,
      records,
      recordsCount: records.length,
      status,
    };
  });

  return {
    clinicalState,
    clinicalVersion,
    clinicalFileErrors: fileErrors,
    clinicalEntities,
    isPendingApproval,
    isSubmissionValidated,
  };
};
