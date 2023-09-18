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

import { css } from "@/lib/emotion";
import { ContentPlaceholder } from "@icgc-argo/uikit";

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

export const ErrorBox = () => (
  <div
    id="error-submit-clinical-data"
    css={css`
      padding: 16px;
    `}
  >
    Error
    {/* <ErrorNotification
      level={NOTIFICATION_VARIANTS.ERROR}
      onClearClick={onErrorClearClick}
      title={`${
        errors.length
      } error(s) found in uploaded ${displayName.toLowerCase()} file`}
      errors={errors.map(toDisplayError)}
      subtitle={
        "Your file cannot be processed. Please correct the following errors and reupload your file."
      }
      columnConfig={getDefaultColumns(NOTIFICATION_VARIANTS.ERROR)}
    /> */}
  </div>
);
