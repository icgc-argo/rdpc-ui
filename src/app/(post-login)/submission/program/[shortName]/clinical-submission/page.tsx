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

import ContentHeader from "@/app/components/Content/ContentHeader";
import ContentMain from "@/app/components/Content/ContentMain";
import CLINICAL_SUBMISSION_QUERY from "@/app/gql/CLINICAL_SUBMISSION_QUERY";
import { useAppConfigContext } from "@/app/hooks/AppProvider";
import { notNull } from "@/global/utils";
import { css } from "@/lib/emotion";
import { useQuery } from "@apollo/client";
import urlJoin from "url-join";
import Instructions from "./components/Instructions";
import ProgressBar from "./components/ProgressBar";

const ClinicalSubmission = ({
  params: { shortName },
}: {
  params: { shortName: string };
}) => {
  // docs url
  const { DOCS_URL_ROOT } = useAppConfigContext();
  const helpUrl = urlJoin(
    DOCS_URL_ROOT,
    "/docs/submission/submitting-clinical-data",
  );

  const { data } = useQuery(CLINICAL_SUBMISSION_QUERY, {
    variables: {
      shortName,
    },
  });
  const clinicalState = data?.clinicalSubmissions.state;
  const clinicalEntities =
    data?.clinicalSubmissions.clinicalEntities?.filter(notNull) || [];

  console.log("gql query", data);

  return (
    <>
      <div
        css={css`
          display: flex;
          flex-direction: column;
        `}
      >
        <ContentHeader
          breadcrumb={[shortName, "Submit Clinical Data"]}
          helpUrl={helpUrl}
        >
          <ProgressBar
            clinicalEntities={data?.clinicalSubmissions.clinicalEntities}
            clinicalState={data?.clinicalSubmissions.state}
          />
        </ContentHeader>
        <ContentMain>
          <Instructions />
        </ContentMain>
      </div>
    </>
  );
};

export default ClinicalSubmission;