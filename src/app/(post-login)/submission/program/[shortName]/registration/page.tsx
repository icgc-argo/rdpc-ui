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

import {
  ClinicalFileError,
  ClinicalRegistrationData,
} from "@/__generated__/graphql";
import ContentHeader from "@/app/components/Content/ContentHeader";
import ContentMain from "@/app/components/Content/ContentMain";
import NoDataMessage from "@/app/components/NoData";
import Instructions from "@/app/components/page/submission/program/registration/Instructions";
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
import { get } from "lodash";
import FileTable, { FileEntry } from "./components/FileTable";

const recordsToFileTable = (
  records: ClinicalRegistrationData[],
  newRows: Array<number>,
): Array<FileEntry> =>
  records.map((record) => {
    const fields = get(record, "fields", []);
    const data = fields.reduce(
      // @ts-expect-error
      (acc, cur) => ({ ...acc, [cur.name]: cur.value }),
      {} as any,
    ); // @ts-expect-error

    return { ...data, row: record.row, isNew: newRows.includes(record.row) };
  });

const FilePreview = () => (
  <>
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      `}
    >
      <Typography
        css={css`
          margin: 0;
        `}
        color="primary"
        variant="subtitle2"
        component="h2"
      >
        File Preview
      </Typography>
      <Button
        id="button-register-clear-file"
        variant={BUTTON_VARIANTS.TEXT}
        size={BUTTON_SIZES.SM}
        onClick={() => alert("click")}
        disabled={false}
      >
        <Typography variant="data">Clear</Typography>
      </Button>
    </div>
    <FileTable
      //	records={recordsToFileTable(fileRecords, newRows)}
      records={[]}
      stats={undefined}
      submissionInfo={{ fileName: "", createdAt: "", creator: "" }}
    />
  </>
);

export default function Register({
  params: { shortName },
}: {
  params: { shortName: string };
}) {
  const {
    data,
    loading,
    refetch,
    updateQuery: updateClinicalRegistrationQuery,
  } = useQuery(GET_REGISTRATION_QUERY, {
    variables: { shortName },
  });

  const [uploadFile, { loading: isUploading }] = useMutation(
    UPLOAD_REGISTRATION_MUTATION,
    {
      onError: (e) => {
        //commonToaster.unknownError();
        console.error(e);
      },
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

  const fileErrors: ClinicalFileError[] = [
    { fileNames: ["input"], message: "didt upload", code: "code?" },
  ];

  return (
    <div>
      <ContentHeader
        breadcrumb={["CIA-IE", "Register Samples"]}
        progress={{ upload: "pending", register: "success" }}
        helpUrl="www.google.ca"
      />
      <ContentMain>
        <Instructions
          dictionaryVersion={"11"}
          handleUpload={handleUpload}
          isUploading={isUploading}
          handleRegister={handleRegister}
          flags={instructionFlags}
        />
        {fileErrors.map(({ fileNames, message }, i) => (
          <Notification
            key={i}
            size="SM"
            variant="ERROR"
            interactionType="CLOSE"
            title={`File failed to upload: ${fileNames.join(", ")}`}
            content={message}
            onInteraction={() => null}
          />
        ))}

        <NoDataMessage loading={false} />
        <FilePreview />
      </ContentMain>
    </div>
  );
}
