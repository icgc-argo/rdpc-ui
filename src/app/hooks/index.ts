/*
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
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

export * from './ApolloProvider';
export * from './AppProvider';
export * from './AuthProvider';
export {
	default as GlobalLoaderProvider,
	loaderPortalRef,
	useGlobalLoader,
} from './GlobalLoaderProvider';
export { ARGOTheme, default as ThemeProvider } from './ThemeProvider';
export { default as ToastProvider, useToaster } from './ToastProvider';
export * from './useApolloQuery';
export { default as useCommonToasters } from './useCommonToasters';
export { default as usePageContext } from './usePageContext';
export * from './useSubmissionSystemStatus';
export * from './useTimeout';
export { default as useUrlQueryState } from './useURLQueryState';
export { default as useUrlParamState } from './useUrlParamState';
export { default as useUserConfirmationModalState } from './useUserConfirmationModalState';
export { default as useUserRole } from './useUserRole';
