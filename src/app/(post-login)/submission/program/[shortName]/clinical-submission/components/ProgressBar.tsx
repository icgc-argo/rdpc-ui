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

import { ClinicalSubmissionData } from "@/__generated__/graphql";
import { useSubmissionSystemStatus } from "@/app/hooks/useSubmissionSystemStatus";
import { Progress, ProgressStatus } from "@icgc-argo/uikit";
import { FC } from "react";

type ProgressBarProps = {
  clinicalSubmissions: ClinicalSubmissionData;
};

const ProgressBar: FC<ProgressBarProps> = ({ clinicalSubmissions }) => {
  const { isDisabled: isSubmissionSystemDisabled } =
    useSubmissionSystemStatus();

  const state = clinicalSubmissions.state;
  const clinicalEntities =
    clinicalSubmissions.clinicalEntities === null
      ? []
      : clinicalSubmissions.clinicalEntities;

  const allDataErrors = clinicalEntities.reduce<
    Array<
      ClinicalSubmissionError & {
        fileName: string;
      }
    >
  >(
    (acc, entity) => [
      ...acc,
      ...entity.dataErrors.map((err) => ({
        ...err,
        fileName: entity.batchName,
      })),
    ],
    [],
  );

  const hasDataError = !!allDataErrors.length;
  const hasSchemaError =
    !!clinicalEntities.length &&
    clinicalEntities.some(({ schemaErrors }) => !!schemaErrors.length);
  const hasSomeEntity = clinicalEntities.some(
    ({ records }) => !!records.length,
  );
  const hasSchemaErrorsAfterMigration = state === "INVALID_BY_MIGRATION";
  const isReadyForValidation =
    hasSomeEntity && !hasSchemaError && !hasSchemaErrorsAfterMigration;
  const isReadyForSignoff = isReadyForValidation && state === "VALID";
  const isPendingApproval = state === "PENDING_APPROVAL";

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
