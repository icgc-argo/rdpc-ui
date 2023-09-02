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

import { ClinicalRegistrationData } from "@/__generated__/graphql";
import ContentHeader from "@/app/components/Content/ContentHeader";
import ContentMain from "@/app/components/Content/ContentMain";
import ProgressBar from "@/app/components/Content/ProgressBar";
import NoDataMessage from "@/app/components/NoData";
import Instructions from "@/app/components/page/submission/program/registration/Instructions";
import CLEAR_CLINICAL_REGISTRATION_MUTATION from "@/app/gql/CLEAR_CLINICAL_REGISTRATION_MUTATION";
import GET_REGISTRATION_QUERY from "@/app/gql/GET_REGISTRATION_QUERY";
import UPLOAD_REGISTRATION_MUTATION from "@/app/gql/UPLOAD_REGISTRATION_MUTATION";
import { css } from "@/lib/emotion";
import { useMutation, useQuery } from "@apollo/client";
import {
  BUTTON_SIZES,
  BUTTON_VARIANTS,
  Button,
  Notification,
  Typography,
} from "@icgc-argo/uikit";
import { get, union } from "lodash";
import { FC, ReactNode } from "react";
import FileTable from "./components/FileTable";

export type FileTableData = ClinicalRegistrationData & {
  row: number;
  isNew: boolean;
};

const recordsToFileTable = (
  records: ClinicalRegistrationData[],
  newRows: Array<number>,
): FileTableData[] =>
  records.map((record) => {
    const fields = get(record, "fields", []);
    const data = fields.reduce(
      // @ts-expect-error
      (acc, cur) => ({ ...acc, [cur.name]: cur.value }),
      {} as any,
    ); // @ts-expect-error

    return { ...data, row: record.row, isNew: newRows.includes(record.row) };
  });

const FilePreview = ({
  registration,
}: {
  registration: ClinicalRegistrationData;
}) => {
  const fileRecords = get(registration, "records", []);
  console.log("file records", fileRecords);

  const {
    createdAt = "",
    creator = "",
    fileName = "",
    alreadyRegistered: { count: alreadyRegisteredCount = 0 },
    newDonors: { rows: newDonors },
    newSamples: { rows: newSamples },
    newSpecimens: { rows: newSpecimens },
  } = registration;

  const submissionInfo = { createdAt, creator, fileName };
  const newRows = union(newDonors, newSamples, newSpecimens);
  const stats = {
    newCount: newRows.length,
    existingCount: alreadyRegisteredCount,
  };

  const records = recordsToFileTable(fileRecords, newRows);

  console.log("new rows", newRows);
  console.log("stats", stats);
  console.log("records", records);

  return (
    <FileTable
      records={records}
      stats={stats}
      submissionInfo={submissionInfo}
    />
  );
};

type CardProps = { title: string; action?: ReactNode; children: ReactNode };
const Card: FC<CardProps> = ({ title, action, children }) => (
  <div
    css={css`
      padding: 9px;
    `}
  >
    <div
      css={css`
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      `}
    >
      <Typography
        css={css`
          margin: 0 0 8px 0;
        `}
        color="primary"
        variant="subtitle2"
        component="h2"
      >
        {title}
      </Typography>
      {action}
    </div>

    {children}
  </div>
);

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
      refetchQueries: [GET_REGISTRATION_QUERY, "GetRegistration"],
    },
  );

  const handleUpload = (file: File) =>
    uploadFile({
      variables: { shortName, registrationFile: file },
    });

  const handleRegister = () => {
    console.log("register");
  };

  const instructionFlags = {
    uploadEnabled: true,
    registrationEnabled: true,
  };

  const state = false;

  //
  const isSubmissionSystemDisabled = false;
  const hasClinicalRegistration = !!(
    clinicalRegistration && clinicalRegistration.records.length
  );
  const hasErrors = !!schemaOrValidationErrors.length;

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
          registrationId: get(clinicalRegistration, "id"),
        },
      });
      await refetch();
    } catch (err) {
      await refetch();
      // toaster.addToast({
      //   variant: "ERROR",
      //   title: "Something went wrong",
      //   content:
      //     "Uh oh! It looks like something went wrong. This page has been reloaded.",
      // });
      alert(err);
    }
  };

  return (
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
            title={`File failed to upload: ${fileError?.fileNames.join(", ")}`}
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
          <div>Error</div>
        ) : (
          <NoDataMessage loading={false} />
        )}
      </ContentMain>
    </div>
  );
}
