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

import Card from "@/app/components/Card";
import ContentHeader from "@/app/components/Content/ContentHeader";
import ContentMain from "@/app/components/Content/ContentMain";
import ProgressBar from "@/app/components/Content/ProgressBar";
import NoDataMessage from "@/app/components/NoData";
import Instructions from "@/app/components/page/submission/program/registration/Instructions";
import CLEAR_CLINICAL_REGISTRATION_MUTATION from "@/app/gql/CLEAR_CLINICAL_REGISTRATION_MUTATION";
import GET_REGISTRATION_QUERY from "@/app/gql/GET_REGISTRATION_QUERY";
import UPLOAD_REGISTRATION_MUTATION from "@/app/gql/UPLOAD_REGISTRATION_MUTATION";
import { useToaster } from "@/app/hooks/ToastProvider";
import { useSubmissionSystemStatus } from "@/app/hooks/useSubmissionSystemStatus";
import { useMutation, useQuery } from "@apollo/client";
import {
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Button,
  NOTIFICATION_VARIANTS,
  Notification,
  Typography,
} from "@icgc-argo/uikit";
import { get } from "lodash";
import { useState } from "react";
import FilePreview from "./components/FilePreview";
import RegisterSamplesModal from "./components/RegisterSampleModal";
import UploadError from "./components/UploadError";

export default function Register({
  params: { shortName },
}: {
  params: { shortName: string };
}) {
  console.log("shortname", shortName);
  const {
    data,
    loading,
    refetch,
    updateQuery: updateClinicalRegistrationQuery,
  } = useQuery(GET_REGISTRATION_QUERY, {
    variables: { shortName },
  });
  const toaster = useToaster();

  const [showRegisterModal, setShowModal] = useState(false);

  const clinicalRegistration = data?.clinicalRegistration;
  const schemaOrValidationErrors = get(clinicalRegistration, "errors", []);
  const fileErrors = get(clinicalRegistration, "fileErrors") || [];

  const [uploadFile, { loading: isUploading }] = useMutation(
    UPLOAD_REGISTRATION_MUTATION,

    {
      onError: (e) => {
        //commonToaster.unknownError();
        console.error(e);
      },
    },
  );

  // this needs error handling TODO
  const handleUpload = (file: File) =>
    uploadFile({
      variables: { shortName, registrationFile: file },
    });

  const handleRegister = () => {
    setShowModal((state) => !state);
  };

  const { isDisabled: isSubmissionSystemDisabled } =
    useSubmissionSystemStatus();

  const instructionFlags = {
    uploadEnabled: !isSubmissionSystemDisabled,
    registrationEnabled:
      !isSubmissionSystemDisabled && !!get(clinicalRegistration, "id"),
  };

  //
  const hasClinicalRegistration = !!(
    clinicalRegistration && clinicalRegistration.records.length
  );
  const hasErrors = !!schemaOrValidationErrors.length;

  const registrationId = get(clinicalRegistration, "id", "");

  // file preview clear
  const [clearRegistration] = useMutation(CLEAR_CLINICAL_REGISTRATION_MUTATION);
  const handleClearClick = async () => {
    if (clinicalRegistration?.id == null) {
      refetch();
      return;
    }

    try {
      await clearRegistration({
        variables: {
          shortName,
          registrationId,
        },
      });
      await refetch();
    } catch (err) {
      await refetch();
      toaster.addToast({
        variant: "ERROR",
        title: "Something went wrong",
        content:
          "Uh oh! It looks like something went wrong. This page has been reloaded.",
      });
    }
  };

  const handleRegisterCancelClick = () => {
    setShowModal(false);
  };

  console.log("CLINICAL RECORSD", clinicalRegistration);

  return (
    <>
      <div>
        <ContentHeader
          breadcrumb={["CIA-IE", "Register Samples"]}
          helpUrl="www.google.ca"
        >
          <ProgressBar
            {...{
              isSubmissionSystemDisabled,
              hasClinicalRegistration,
              hasErrors,
            }}
          />
        </ContentHeader>
        <ContentMain>
          <Instructions
            dictionaryVersion={"11"}
            handleUpload={handleUpload}
            isUploading={isUploading}
            handleRegister={handleRegister}
            flags={instructionFlags}
          />
          {fileErrors.map((fileError, i) => (
            <Notification
              key={i}
              size="SM"
              variant="ERROR"
              interactionType="CLOSE"
              title={`File failed to upload: ${fileError?.fileNames.join(
                ", ",
              )}`}
              content={fileError?.message}
              onInteraction={() => null}
            />
          ))}
          {clinicalRegistration?.records.length ? (
            <Card
              title="File Preview"
              action={
                <Button
                  id="button-register-clear-file"
                  variant={BUTTON_VARIANTS.TEXT}
                  size={BUTTON_SIZES.SM}
                  onClick={handleClearClick}
                  disabled={false}
                >
                  <Typography variant="data">Clear</Typography>
                </Button>
              }
            >
              <FilePreview registration={clinicalRegistration} />
            </Card>
          ) : schemaOrValidationErrors.length ? (
            <UploadError
              level={NOTIFICATION_VARIANTS.ERROR}
              onClearClick={handleClearClick}
              title={`${schemaOrValidationErrors.length.toLocaleString()} error(s) found in uploaded file`}
              errors={[
                {
                  type: "INVALID_PROGRAM_ID",
                  message:
                    "Program ID does not match. Please include the correct Program ID.",
                  row: 0,
                  field: "program_id",
                  value: "CIA-IE",
                  sampleId: "sample_0",
                  donorId: "DO-1",
                  specimenId: "SP1-1",
                },
              ]}
              subtitle={
                "Your file cannot be processed. Please correct the following errors and reupload your file."
              }
            />
          ) : (
            <NoDataMessage loading={false} />
          )}
        </ContentMain>
      </div>

      {/** Modals */}
      {showRegisterModal && (
        <RegisterSamplesModal
          onCancelClick={handleRegisterCancelClick}
          {...{ shortName, registrationId }}
        />
      )}
    </>
  );
}
