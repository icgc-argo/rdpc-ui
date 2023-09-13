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
import { css, useTheme } from "@/lib/emotion";
import { TitleBar, Link as UIKitLink } from "@icgc-argo/uikit";
import Link from "next/link";
import { FunctionComponent, ReactNode } from "react";
import { Row } from "react-grid-system";

type ContentHeaderProps = {
  breadcrumb: string[];
  children?: ReactNode;
  helpUrl: string;
};

const ContentHeader: FunctionComponent<ContentHeaderProps> = ({
  breadcrumb,
  children,
  helpUrl,
}) => {
  const theme = useTheme();
  return (
    <div
      css={css`
        display: flex;
        height: 56px;
        padding: 0 30px;
        align-items: center;
        background-color: ${theme.colors.white};
      `}
    >
      <TitleBar>
        <>{breadcrumb[0]}</>
        <Row nogutter align="center">
          <div
            css={css`
              margin-right: 20px;
            `}
          >
            {breadcrumb[1]}
          </div>
        </Row>
      </TitleBar>
      {children}
      <div
        css={css`
          margin-left: auto;
        `}
      >
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
      </div>
    </div>
  );
};

export default ContentHeader;
