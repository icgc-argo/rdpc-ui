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

import CLINICAL_SCHEMA_VERSION_QUERY from "@/app/gql/CLINICAL_SCHEMA_VERSION";
import { useAppConfigContext } from "@/app/hooks/AppProvider";
import { CLINICAL_TEMPLATE_PATH } from "@/global/constants";
import { css, useTheme } from "@/lib/emotion";
import { useQuery } from "@apollo/client";
import {
  BUTTON_SIZES,
  Button,
  DropdownButton,
  FileSelectButton,
  Icon,
  InstructionBox,
  Link,
  Typography,
  defaultTheme,
} from "@icgc-argo/uikit";
import { capitalize } from "lodash";
import { ComponentProps, useState } from "react";
import urlJoin from "url-join";

export const instructionBoxButtonIconStyle = css`
  margin-right: 5px;
`;
export const instructionBoxButtonContentStyle = css`
  display: flex;
  align-items: center;
`;
export const instructionBoxButtonStyle = css`
  margin-top: 10px;
`;
export const instructionBoxLoadingButtonStyle = (
  theme: typeof defaultTheme,
) => css`
  ${instructionBoxButtonStyle}
  background-color: ${theme.colors.grey_2};
  border-color: ${theme.colors.grey_2};
  &:hover,
  &:disabled,
  &:focus {
    background-color: ${theme.colors.grey_2};
    border-color: ${theme.colors.grey_2};
    cursor: not-allowed;
  }
`;

export const createTSVDownloader =
  (gatewayRoot: string) => (fileName: string) => {
    if (fileName === "all") {
      window.location.assign(
        urlJoin(
          gatewayRoot,
          CLINICAL_TEMPLATE_PATH,
          fileName,
          "?excludeSampleRegistration=true",
        ),
      );
    } else {
      window.location.assign(
        urlJoin(gatewayRoot, CLINICAL_TEMPLATE_PATH, fileName),
      );
    }
  };

const FileTemplatesDownloadButton = ({
  clinicalTypes,
}: {
  clinicalTypes: string[];
}) => {
  const { GATEWAY_API_ROOT } = useAppConfigContext();
  const downloadTsvFileTemplate = createTSVDownloader(GATEWAY_API_ROOT);
  const onItemClick: ComponentProps<typeof DropdownButton>["onItemClick"] = (
    item,
  ) => {
    if (item.value === "all") {
      downloadTsvFileTemplate(`all`);
    } else {
      downloadTsvFileTemplate(`${item.value}.tsv`);
    }
  };

  return (
    <DropdownButton
      css={instructionBoxButtonStyle}
      variant="secondary"
      size="sm"
      onItemClick={onItemClick}
      menuItems={[
        {
          display: "Download All",
          value: "all",
        },
        ...clinicalTypes.map((clinicalType) => ({
          value: clinicalType,
          display: capitalize(clinicalType.split("_").join(" ")),
        })),
      ]}
    >
      <span css={instructionBoxButtonContentStyle}>
        <Icon
          name="download"
          fill="accent2_dark"
          height="12px"
          css={instructionBoxButtonIconStyle}
        />
        File Templates
        <Icon
          name="chevron_down"
          fill="accent2_dark"
          height="9px"
          css={css`
            ${instructionBoxButtonIconStyle}
            margin-left: 5px;
          `}
        />
      </span>
    </DropdownButton>
  );
};

const InstructionLoader = ({ text }: { text: string }) => {
  const theme = useTheme();
  const disabledColor = theme.colors.accent2_dark;

  return (
    <div
      css={css`
        display: flex;
        align-items: center;
        color: ${disabledColor};
      `}
    >
      <Icon
        name="spinner"
        width={"12px"}
        height={"12px"}
        fill={disabledColor}
        css={css`
          margin-right: 4px;
        `}
      />
      {text}
    </div>
  );
};

type InstructionsProps = {
  uploadEnabled: boolean;
  signOffEnabled: boolean;
  validationEnabled: boolean;
  onUploadFileSelect: (f: FileList) => void;
  onValidateClick: () => Promise<any>;
  onSignOffClick: () => Promise<any>;
  clinicalTypes: string[];
};

const Instructions = ({
  clinicalTypes,
  onSignOffClick,
  onUploadFileSelect,
  onValidateClick,
  signOffEnabled,
  uploadEnabled,
  validationEnabled,
}: InstructionsProps) => {
  const { DOCS_URL_ROOT } = useAppConfigContext();

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isSigningOff, setIsSigningOff] = useState<boolean>(false);

  const handleFileUploadClick = async (files: any) => {
    setIsUploading(true);
    await onUploadFileSelect(files);
    setIsUploading(false);
  };

  const handleValidationClick = async () => {
    setIsValidating(true);
    await onValidateClick();
    setIsValidating(false);
  };

  const handleSignOffClick = async () => {
    setIsSigningOff(true);
    await onSignOffClick();
    setIsSigningOff(false);
  };

  const latestDictionaryResponse = useQuery(CLINICAL_SCHEMA_VERSION_QUERY);

  return (
    <div
      css={css`
        padding: 8px;
      `}
    >
      <InstructionBox
        steps={[
          <>
            <Typography variant="data" component="span">
              BEFORE YOU START: Download the clinical file templates and format
              them using{" "}
              <Link
                target="_blank"
                bold
                href={urlJoin(DOCS_URL_ROOT, "/dictionary")}
              >
                Data&nbsp;Dictionary&nbsp;
                {!latestDictionaryResponse.loading &&
                  `v${latestDictionaryResponse?.data?.clinicalSubmissionSchemaVersion}`}
              </Link>
            </Typography>
            <FileTemplatesDownloadButton clinicalTypes={clinicalTypes} />
          </>,
          <>
            <Typography variant="data" component="span">
              1. Upload your formatted clinical TSV files.
            </Typography>
            <FileSelectButton
              isAsync
              css={
                isUploading
                  ? instructionBoxLoadingButtonStyle
                  : instructionBoxButtonStyle
              }
              variant="secondary"
              size={BUTTON_SIZES.SM}
              inputProps={{
                accept: ".tsv",
                multiple: true,
              }}
              onFilesSelect={async (files) => {
                if (files[0]) handleFileUploadClick(files);
              }}
              isLoading={isUploading}
              disabled={!uploadEnabled}
              Loader={() => <InstructionLoader text="VALIDATING FILES" />}
            >
              <span css={instructionBoxButtonContentStyle}>
                <Icon
                  name="upload"
                  fill={uploadEnabled ? "accent2_dark" : "white"}
                  height="12px"
                  css={instructionBoxButtonIconStyle}
                />
                Upload Files
              </span>
            </FileSelectButton>
          </>,
          <>
            <Typography variant="data" component="span">
              2. Validate your entire submission workspace.
            </Typography>
            <Button
              css={
                isValidating
                  ? instructionBoxLoadingButtonStyle
                  : instructionBoxButtonStyle
              }
              variant="primary"
              size={BUTTON_SIZES.SM}
              disabled={!validationEnabled}
              onClick={handleValidationClick}
              isLoading={isValidating}
              isAsync
              Loader={() => <InstructionLoader text="VALIDATING SUBMISSION" />}
            >
              <span css={instructionBoxButtonContentStyle}>
                Validate Submission
              </span>
            </Button>
          </>,
          <>
            <Typography variant="data" component="span">
              3. When your clinical data is valid and QC is complete, sign off
              your submission:
            </Typography>
            <Button
              css={instructionBoxButtonStyle}
              variant="primary"
              size={BUTTON_SIZES.SM}
              disabled={!signOffEnabled}
              onClick={handleSignOffClick}
              isLoading={isSigningOff}
              isAsync
            >
              <span css={instructionBoxButtonContentStyle}>
                Sign Off submission
              </span>
            </Button>
          </>,
        ]}
      />
    </div>
  );
};

export default Instructions;
