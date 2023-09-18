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
"use client";

import { ClinicalSubmissionQuery } from "@/__generated__/graphql";
import { useSubmissionSystemStatus } from "@/app/hooks/useSubmissionSystemStatus";
import { Progress, ProgressStatus } from "@icgc-argo/uikit";
import { isEmpty } from "lodash";
import { FC } from "react";
import { ClinicalSubmission } from "../types";

const checkEntities = (
  clinicalEntities: ProgressBarProps["clinicalEntities"],
) => {
  if (!clinicalEntities || isEmpty(clinicalEntities)) {
    return { hasDataError: false, hasSchemaError: false, hasSomeEntity: false };
  } else {
    const hasDataError = clinicalEntities.some(
      (entity) => entity?.dataErrors?.length,
    );
    const hasSchemaError = clinicalEntities.some(
      (entity) => entity?.schemaErrors.length,
    );
    const hasSomeEntity = clinicalEntities.some(
      (entity) => entity?.records.length,
    );

    return { hasDataError, hasSchemaError, hasSomeEntity };
  }
};

type ProgressBarProps = {
  clinicalEntities: ClinicalSubmission["clinicalEntities"] | undefined;
  clinicalState:
    | ClinicalSubmissionQuery["clinicalSubmissions"]["state"]
    | undefined;
};

const ProgressBar: FC<ProgressBarProps> = ({
  clinicalEntities,
  clinicalState,
}) => {
  const { isDisabled: isSubmissionSystemDisabled } =
    useSubmissionSystemStatus();

  const { hasDataError, hasSchemaError, hasSomeEntity } =
    checkEntities(clinicalEntities);

  const hasSchemaErrorsAfterMigration =
    clinicalState === "INVALID_BY_MIGRATION";
  const isReadyForValidation =
    hasSomeEntity && !hasSchemaError && !hasSchemaErrorsAfterMigration;
  const isReadyForSignoff = isReadyForValidation && clinicalState === "VALID";
  const isPendingApproval = clinicalState === "PENDING_APPROVAL";

  const progressStates: {
    upload: ProgressStatus;
    validate: ProgressStatus;
    signOff: ProgressStatus;
  } = {
    upload: isSubmissionSystemDisabled
      ? "locked"
      : isReadyForValidation
      ? "success"
      : hasSchemaError || hasSchemaErrorsAfterMigration
      ? "error"
      : "disabled",
    validate: isSubmissionSystemDisabled
      ? "locked"
      : isReadyForSignoff || isPendingApproval
      ? "success"
      : isReadyForValidation
      ? hasDataError
        ? "error"
        : "pending"
      : "disabled",
    signOff: isSubmissionSystemDisabled
      ? "locked"
      : isReadyForSignoff
      ? "pending"
      : isPendingApproval
      ? "success"
      : "disabled",
  };
  return (
    <Progress>
      <Progress.Item state={progressStates.upload} text="Upload" />
      <Progress.Item state={progressStates.validate} text="Validate" />
      <Progress.Item state={progressStates.signOff} text="Sign Off" />
    </Progress>
  );
};

export default ProgressBar;
