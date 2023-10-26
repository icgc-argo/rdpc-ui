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
// all our context providers won't work server side, beacuse React.Context is client side
"use client";

import { ApolloProvider } from "@/app/hooks/ApolloProvider";
import { AppProvider } from "@/app/hooks/AppProvider";
import GlobalLoaderProvider, {
  loaderPortalRef,
} from "@/app/hooks/GlobalLoaderProvider";
import ThemeProvider from "@/app/hooks/ThemeProvider";
import ToastProvider from "@/app/hooks/ToastProvider";
import { AuthProvider } from "@/global/utils/auth";
import { css } from "@/lib/emotion";
import { loadDevMessages, loadErrorMessages } from "@apollo/client/dev";
import { ReactNode, forwardRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { modalPortalRef } from "./components/Modal";

// Apollo on app error messaging instead of error messages in webpages
if (process.env.NODE_ENV === "development") {
  // Adds messages only in a dev environment
  loadDevMessages();
  loadErrorMessages();
}

const queryClient = new QueryClient();

// div to render portals into
const PortalParent = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    css={css`
      position: fixed;
      left: 0px;
      top: 0px;
      z-index: 9999;
    `}
  />
));
PortalParent.displayName = "PortalParent";

const ModalPortalParent = () => <PortalParent ref={modalPortalRef} />;
const GlobalLoaderParent = () => <PortalParent ref={loaderPortalRef} />;

const App = ({ children, config }: { children: ReactNode; config: any }) => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <AppProvider config={config}>
        <AuthProvider>
          <ApolloProvider>
            <ToastProvider>
              <ModalPortalParent />
              <GlobalLoaderParent />
              <GlobalLoaderProvider>
                <div
                  css={css`
                    display: grid;
                    grid-template-rows: 58px 1fr 59px; /* header + content + footer*/
                    min-height: 100vh;
                  `}
                >
                  <Header />
                  {children}
                  <Footer />
                </div>
              </GlobalLoaderProvider>
            </ToastProvider>
          </ApolloProvider>
        </AuthProvider>
      </AppProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
