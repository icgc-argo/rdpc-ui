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

import APPROVE_SUBMISSION_MUTATION from "@/app/gql/APPROVE_SUBMISSION_MUTATION";
import CLEAR_CLINICAL_SUBMISSION from "@/app/gql/CLEAR_CLINICAL_SUBMISSION";
import REOPEN_SUBMISSION_MUTATION from "@/app/gql/REOPEN_SUBMISSION_MUTATION";
import { useAppConfigContext } from "@/app/hooks/AppProvider";
import { useGlobalLoader } from "@/app/hooks/GlobalLoaderProvider";
import { useToaster } from "@/app/hooks/ToastProvider";
import useCommonToasters from "@/app/hooks/useCommonToasters";
import { useSubmissionSystemStatus } from "@/app/hooks/useSubmissionSystemStatus";
import { sleep } from "@/global/utils";
import { useAuthContext } from "@/global/utils/auth";
import { css, useTheme } from "@/lib/emotion";
import { useMutation } from "@apollo/client";
import { Button, TitleBar, Link as UIKitLink } from "@icgc-argo/uikit";
import Link from "next/link";
import { FC, useMemo } from "react";
import { Row } from "react-grid-system";
import urlJoin from "url-join";
import ProgressBar from "./ProgressBar";

type HeaderProps = {
  programShortName: string;
  showProgress: boolean;
  clinicalVersion: string;
  clinicalEntities: any;
  clinicalState: any;
  refetch: any;
  updateQuery: any;
};
const Header: FC<HeaderProps> = ({
  programShortName,
  showProgress,
  clinicalVersion,
  clinicalEntities,
  clinicalState,
  refetch: refetchClinicalSubmission,
  updateQuery: updateClinicalSubmissionQuery,
}) => {
  const theme = useTheme();

  // docs url
  const { DOCS_URL_ROOT } = useAppConfigContext();
  const helpUrl = urlJoin(
    DOCS_URL_ROOT,
    "/docs/submission/submitting-clinical-data",
  );
  const { egoJwt, permissions, TokenUtils } = useAuthContext();

  const isDcc = useMemo(() => TokenUtils.isDccMember(permissions), [egoJwt]);

  const isPendingApproval = clinicalState === "PENDING_APPROVAL";

  const { setGlobalLoading } = useGlobalLoader();

  const commonToaster = useCommonToasters();
  const toaster = useToaster();

  const { isDisabled: isSubmissionSystemDisabled } =
    useSubmissionSystemStatus();

  const [reopenSubmission] = useMutation(REOPEN_SUBMISSION_MUTATION, {
    variables: {
      programShortName,
      submissionVersion: clinicalVersion,
    },
  });

  const [approveClinicalSubmission] = useMutation(APPROVE_SUBMISSION_MUTATION, {
    variables: {
      programShortName,
      submissionVersion: clinicalVersion,
    },
  });

  const [clearClinicalSubmission] = useMutation(CLEAR_CLINICAL_SUBMISSION, {
    variables: {
      programShortName,
      submissionVersion: clinicalVersion,
    },
  });

  const handleSubmissionReopen = async () => {
    console.log("handle submission reoepn");
  };

  const handleSubmissionApproval = async () => {
    console.log("handle submission approval");
  };

  const handleSubmissionClear = async () => {
    setGlobalLoading(true);
    await sleep();
    try {
      await clearClinicalSubmission();
      toaster.addToast({
        variant: "SUCCESS",
        interactionType: "CLOSE",
        title: "Submission cleared",
        content: `All uploaded clinical files have been cleared.`,
      });
    } catch (err) {
      await refetchClinicalSubmission();
      commonToaster.unknownErrorWithReloadMessage();
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <>
      <div
        css={css`
          display: flex;
          height: 56px;
          padding: 0 30px;
          background-color: ${theme.colors.white};
          justify-content: space-between;
          align-items: center;
          width: 100%;
        `}
      >
        <TitleBar>
          <>{programShortName}</>
          <Row nogutter align="center">
            <div
              css={css`
                margin-right: 20px;
              `}
            >
              Submit Clinical Data
            </div>
            {showProgress && (
              <ProgressBar
                clinicalEntities={clinicalEntities}
                clinicalState={clinicalState}
              />
            )}
          </Row>
        </TitleBar>
        <Row nogutter align="center">
          {isPendingApproval && (
            <Button
              id="button-reopen"
              variant={isDcc ? "secondary" : "text"}
              isAsync
              css={css`
                margin-right: 10px;
              `}
              onClick={handleSubmissionReopen}
            >
              {isDcc ? "reopen" : "reopen submission"}
            </Button>
          )}
          {!isPendingApproval && (
            <>
              <Button
                variant="text"
                css={css`
                  margin-right: 10px;
                `}
                disabled={isSubmissionSystemDisabled || !clinicalVersion}
                onClick={handleSubmissionClear}
              >
                Clear submission
              </Button>
              <Link href={helpUrl} legacyBehavior>
                <UIKitLink
                  target="_blank"
                  css={css`
                    font-size: 14px;
                  `}
                  withChevron
                  href={helpUrl}
                  underline={false}
                  bold
                >
                  HELP
                </UIKitLink>
              </Link>
            </>
          )}
          {isDcc && isPendingApproval && (
            <>
              <Button
                id="button-approve"
                size="sm"
                isAsync
                onClick={handleSubmissionApproval}
              >
                approve
              </Button>
            </>
          )}
        </Row>
      </div>
    </>
  );
};

export default Header;
