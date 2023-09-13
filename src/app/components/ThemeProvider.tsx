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

import {
  Global,
  ThemeProvider as UIKitThemeProvider,
  css,
  defaultTheme,
} from "@/lib/emotion";
import { mapValues } from "lodash";
import { Work_Sans } from "next/font/google";

/**
 * Load font using Next apis
 * merge this font style with default theme typography
 * apply complete theme to project using ThemeProvider
 */
const workSans = Work_Sans({ subsets: ["latin"] });
const typography = mapValues(defaultTheme.typography, (typography) => ({
  ...typography,
  fontFamily: workSans.style.fontFamily,
}));
const theme = { ...defaultTheme, typography };

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Global
        styles={css`
          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          * {
            margin: 0;
          }

          :root {
            font-size: 62.5%;
          }

          body {
            line-height: 1.5;
            font-family: ${workSans.style.fontFamily};
          }

          input,
          button,
          textarea,
          select {
            font: inherit;
          }

          p,
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            overflow-wrap: break-word;
          }

          #root,
          #__next {
            isolation: isolate;
          }

          // react-table override
          .rt-table-container {
            .rt-th-wrapper,
            .rt-td-wrapper {
              font-family: inherit;
            }
            .rt-table {
              display: block;
              width: 0;
            }
          }
        `}
      />
      <UIKitThemeProvider theme={theme}>{children}</UIKitThemeProvider>
    </>
  );
}
