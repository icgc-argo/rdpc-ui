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

import ModalPortal from "@/app/components/Modal";
import { useGlobalLoader } from "@/app/hooks/GlobalLoaderProvider";
import { useToaster } from "@/app/hooks/ToastProvider";
import useCommonToasters from "@/app/hooks/useCommonToasters";
import { sleep } from "@/global/utils";
import { css } from "@/lib/emotion";
//import { isDccMember } from "@icgc-argo/ego-token-utils/dist/argoRoleChecks";
import { useSubmissionSystemStatus } from "@/app/hooks/useSubmissionSystemStatus";
import { Button, Modal, TitleBar } from "@icgc-argo/uikit";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import { Row } from "react-grid-system";
import { useMutation } from "react-query";
import ProgressBar from "./ProgressBar";

type HeaderProps = {
  programShortName: string;
  showProgress: boolean;
  isPendingApproval: boolean;
  clinicalVersion: string;
  clinicalEntities: any;
  clinicalState: any;
};
const Header: FC<HeaderProps> = ({
  programShortName,
  showProgress,
  isPendingApproval,
  clinicalVersion,
  clinicalEntities,
  clinicalState,
}) => {
  //const { egoJwt, permissions } = useAuthContext();
  //const isDcc = useMemo(() => isDccMember(permissions), [egoJwt]);
  const isDcc = false;
  const { isModalShown, getUserConfirmation, modalProps } =
    useUserConfirmationModalState();
  const { setGlobalLoading } = useGlobalLoader();
  const {
    refetch: refetchClinicalSubmission,
    updateQuery: updateClinicalSubmissionQuery,
  } = useClinicalSubmissionQuery(programShortName);

  const commonToaster = useCommonToasters();
  const router = useRouter();
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

  const [clearClinicalSubmission] = useMutation(CLEAR_SUBMISSION_MUTATION, {
    variables: {
      programShortName,
      submissionVersion: clinicalVersion,
    },
  });

  const handleSubmissionReopen = async () => {
    console.log("handle submission reoepn");
    // const didUserConfirm = await getUserConfirmation({
    //   title: isDcc
    //     ? "Reopen Submission?"
    //     : "Are you sure you want to reopen your submission?",
    //   children: isDcc
    //     ? "Are you sure you want to reopen this clinical submission?"
    //     : "If you reopen your clinical submission it will be recalled from DCC approval and your workspace will be open for modifications.",
    //   actionButtonText: isDcc ? "Yes, Reopen" : "Yes, Reopen Submission",
    //   actionButtonId: "modal-confirm-reopen",
    //   buttonSize: "sm",
    // });
    // if (didUserConfirm) {
    //   setGlobalLoading(true);
    //   await sleep();
    //   try {
    //     await reopenSubmission();
    //   } catch (err) {
    //     await refetchClinicalSubmission();
    //     commonToaster.unknownErrorWithReloadMessage();
    //   } finally {
    //     setGlobalLoading(false);
    //   }
    // }
  };

  const handleSubmissionApproval = async () => {
    console.log("handle submission approval");
    // const didUserConfirm = await getUserConfirmation({
    //   title: "Approve Submission?",
    //   children: "Are you sure you want to approve this clinical submission?",
    //   actionButtonText: "Yes, Approve",
    //   actionButtonId: "modal-confirm-approve",
    //   buttonSize: "sm",
    // });
    // if (didUserConfirm) {
    //   setGlobalLoading(true);
    //   await sleep();
    //   try {
    //     await approveClinicalSubmission();
    //     updateClinicalSubmissionQuery((previous) => ({
    //       ...previous,
    //       clinicalSubmissions:
    //         placeholderClinicalSubmissionQueryData(programShortName)
    //           .clinicalSubmissions,
    //     }));
    //     router.push(DCC_DASHBOARD_PATH);
    //     toaster.addToast({
    //       variant: "SUCCESS",
    //       interactionType: "CLOSE",
    //       title: "Clinical Data is successfully approved",
    //       content: `${programShortName} updated clinical data has been approved.`,
    //     });
    //   } catch (err) {
    //     await refetchClinicalSubmission();
    //     commonToaster.unknownErrorWithReloadMessage();
    //   } finally {
    //     setGlobalLoading(false);
    //   }
    // }
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
      {isModalShown && (
        <ModalPortal>
          <Modal {...modalProps} />
        </ModalPortal>
      )}
      <div
        css={css`
          display: flex;
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
              <Link
                target="_blank"
                href={DOCS_SUBMITTING_CLINICAL_DATA_PAGE}
                bold
                withChevron
                uppercase
                underline={false}
                css={css`
                  font-size: 14px;
                `}
              >
                HELP
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
