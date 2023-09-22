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

import ErrorNotification from "@/app/components/ErrorNotification";
import ErrorNotificationDefaultTable, {
  getDefaultErrorReportColumns,
} from "@/app/components/ErrorNotification/ErrorNotificationDefaultTable";
import { toDisplayError } from "@/global/utils";
import { css } from "@/lib/emotion";
import { ContentPlaceholder, NOTIFICATION_VARIANTS } from "@icgc-argo/uikit";

export const NoContentPlaceholder = () => (
  <div
    css={css`
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
    `}
  >
    <ContentPlaceholder
      title="You do not have any data uploaded."
      subtitle="Follow the instructions above to get started."
    />
  </div>
);

type ErrorBoxProps = {
  onClearClick: () => void;
  data: any;
  selectedFile: any;
};
export const ErrorBox = ({ onClearClick, selectedFile }: ErrorBoxProps) => {
  const level = NOTIFICATION_VARIANTS.ERROR;
  const data = selectedFile.schemaErrors.map(toDisplayError);
  return (
    <div
      id="error-submit-clinical-data"
      css={css`
        padding: 16px;
      `}
    >
      <ErrorNotification
        level={level}
        onClearClick={onClearClick}
        reportColumns={getDefaultErrorReportColumns(level)}
        reportData={data}
        subtitle={
          "Your file cannot be processed. Please correct the following errors and reupload your file."
        }
        tableComponent={<ErrorNotificationDefaultTable {...{ data, level }} />}
        title={`${
          selectedFile.schemaErrors.length
        } error(s) found in uploaded ${selectedFile.displayName.toLowerCase()} file`}
      />
    </div>
  );
};
