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

import { useGlobalLoader } from "@/app/hooks/GlobalLoaderProvider";
import { useToaster } from "@/app/hooks/ToastProvider";
import useCommonToasters from "@/app/hooks/useCommonToasters";
import { sleep } from "@/global/utils";
import { css } from "@/lib/emotion";
import { Button } from "@icgc-argo/uikit";
import { FC } from "react";

type ClearSubmissionButtonProps = {
  isDisabled: boolean;
  clearSubmission: () => void;
  refetchSubmission: () => void;
};
const ClearSubmissionButton: FC<ClearSubmissionButtonProps> = ({
  isDisabled,
  clearSubmission,
  refetchSubmission,
}) => {
  const handleSubmissionClear = async () => {
    const toaster = useToaster();
    const commonToaster = useCommonToasters();
    const { setGlobalLoading } = useGlobalLoader();

    setGlobalLoading(true);
    await sleep(0);
    try {
      await clearSubmission();
      toaster.addToast({
        variant: "SUCCESS",
        interactionType: "CLOSE",
        title: "Submission cleared",
        content: `All uploaded clinical files have been cleared.`,
      });
    } catch (err) {
      await refetchSubmission();
      commonToaster.unknownErrorWithReloadMessage();
    } finally {
      setGlobalLoading(false);
    }
  };

  return (
    <Button
      variant="text"
      css={css`
        margin-right: 10px;
      `}
      disabled={isDisabled}
      onClick={handleSubmissionClear}
    >
      Clear submission
    </Button>
  );
};

export default ClearSubmissionButton;
