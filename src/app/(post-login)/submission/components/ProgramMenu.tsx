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

import Loader from "@/app/components/Loader";
import SIDEMENU_PROGRAMS from "@/app/gql/SIDEMENU_PROGRAMS";
import { useSubmissionSystemStatus } from "@/app/hooks/useSubmissionSystemStatus";
import { notNull } from "@/global/utils/types";
import { css } from "@/lib/emotion";
import { useQuery } from "@apollo/client";
import { MenuItem } from "@icgc-argo/uikit";
import Link from "next/link";
import { notFound, usePathname } from "next/navigation";
import { MouseEventHandler, useState } from "react";

const StatusMenuItem = () => {
  const { isDisabled: isSubmissionSystemDisabled } =
    useSubmissionSystemStatus();
  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        width: 100%;
        align-items: center;
        padding-right: 15px;
      `}
    >
      Register Samples
      {/* {isSubmissionSystemDisabled ? (
        <Icon name="lock" fill="accent3_dark" width="15px" />
      ) : clinicalRegistrationHasError ? (
        <Icon name="exclamation" fill="error" width="15px" />
      ) : clinicalRegistrationInProgress ? (
        <Icon name="ellipses" fill="warning" width="15px" />
      ) : null} */}
    </div>
  );
};

export default function ProgramMenu({ searchQuery }: { searchQuery: string }) {
  const { data, loading, error } = useQuery(SIDEMENU_PROGRAMS, {
    variables: {
      shortName: "cia-ca",
    },
  });

  const [activeProgramIndex, setActiveProgramIndex] = useState(-1);

  const pathname = usePathname();

  const programs = data?.programs?.filter(notNull) || [];
  const filteredPrograms = !searchQuery.length
    ? programs
    : programs.filter(
        ({ shortName }) => shortName.search(new RegExp(searchQuery, "i")) > -1,
      );

  const setActiveProgram =
    (index: number): MouseEventHandler =>
    () =>
      setActiveProgramIndex(index);

  if (loading) return <Loader />;
  if (error) notFound();
  return (
    <>
      <Link
        href="/submission"
        css={css`
          text-decoration: none !important;
        `}
      >
        <MenuItem
          level={2}
          content="All Programs"
          onClick={setActiveProgram(-1)}
          selected={pathname === "/submission"}
        />
      </Link>

      {filteredPrograms.map(({ shortName }, programIndex) => (
        <MenuItem
          level={2}
          key={shortName}
          content={shortName}
          onClick={setActiveProgram(programIndex)}
          selected={programIndex === activeProgramIndex}
        >
          <MenuItem level={3}>{shortName}</MenuItem>
          <Link href={`/submission/program/${shortName}/registration`}>
            <MenuItem level={3} content={<StatusMenuItem />} />
          </Link>
        </MenuItem>
      ))}
    </>
  );
}
