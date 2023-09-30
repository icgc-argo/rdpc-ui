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
import useUrlQueryState from "@/app/hooks/useURLQueryState";
import { notNull } from "@/global/utils";
import { css } from "@/lib/emotion";
import { Icon, VerticalTabs } from "@icgc-argo/uikit";
import Link from "next/link";
import { FC, SyntheticEvent } from "react";
import { URL_QUERY_KEY } from "../../page";
import { ClinicalEntities, ClinicalSubmissionEntity } from "../../types";

export const VerticalTabsSection: FC<{
  fileStates: ClinicalEntities;
  selectedFile: ClinicalSubmissionEntity | undefined;
  onFileSelect: (clinicalType: string) => void;
}> = ({ fileStates, selectedFile, onFileSelect }) => {
  // handler
  const onFileClick =
    (clinicalType: string) => (e: SyntheticEvent<HTMLElement, Event>) =>
      onFileSelect(clinicalType);
  // state
  const [query, createUrl] = useUrlQueryState(URL_QUERY_KEY);

  return (
    <div
      css={css`
        width: 170px;
        max-width: 170px;
        min-width: 170px;
        overflow: visible;
      `}
    >
      <VerticalTabs
        css={css`
          height: 100%;
        `}
      >
        {fileStates?.filter(notNull).map((fileState) => (
          <Link href={createUrl(fileState.clinicalType)}>
            <VerticalTabs.Item
              key={fileState.clinicalType}
              active={selectedFile?.clinicalType === fileState.clinicalType}
              onClick={onFileClick(fileState.clinicalType)}
            >
              <div
                css={css`
                  text-align: left;
                `}
              >
                {fileState.displayName}
              </div>
              {!!fileState.recordsCount &&
                fileState.status !== "NONE" &&
                fileState.status !== "ERROR" && (
                  <VerticalTabs.Tag variant={fileState.status}>
                    {fileState.recordsCount}
                  </VerticalTabs.Tag>
                )}
              {fileState.status === "ERROR" && (
                <VerticalTabs.Tag variant="ERROR">
                  <Icon
                    name="exclamation"
                    fill="#fff"
                    height="10px"
                    width="10px"
                  />
                </VerticalTabs.Tag>
              )}
            </VerticalTabs.Item>
          </Link>
        ))}
      </VerticalTabs>
    </div>
  );
};

export default VerticalTabsSection;
