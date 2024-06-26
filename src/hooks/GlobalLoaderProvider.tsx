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

import { FadingDiv } from '@/components/FadingDiv';
import { fillAvailableHeight, fillAvailableWidth } from '@/components/Modal';
import { DnaLoader, Modal, css } from '@icgc-argo/uikit';
import { FC, ReactNode, createContext, createRef, useContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

/*
 * ############################################################################
 * Instructions for using the global loader:
 *
 * 1. Use the useGlobalLoader() hook rather than adding more loaders.
 * 2. Use setGlobalLoader(true) to show the loader.
 * 3. Use setGlobalLoader(false) to hide the loader.
 * 4. OPTIONAL: To show the loader when the page loads,
 *    add `startWithGlobalLoader: true` in createPage().
 *    This is used by getInitialProps and only runs on 1st render.
 */

export type IsGlobalLoading = boolean;

export const GLOBAL_LOADING_DEFAULT = false;

export const loaderPortalRef = createRef<HTMLDivElement>();

const GlobalLoaderView = ({ isGlobalLoading }: { isGlobalLoading: IsGlobalLoading }) => {
	const ref = loaderPortalRef.current;
	const fadeIn = 400;
	const fadeOut = 600;

	return ref
		? ReactDOM.createPortal(
				<CSSTransition in={isGlobalLoading} timeout={fadeIn} classNames="on" unmountOnExit>
					{() => (
						<FadingDiv enterAnimationLength={fadeIn} exitAnimationLength={fadeOut}>
							<Modal.Overlay
								css={css`
									${fillAvailableWidth}
									${fillAvailableHeight}
                  @media (min-width: 768px) {
										width: 100vw;
										height: 100vh;
									}
								`}
							>
								<DnaLoader />
							</Modal.Overlay>
						</FadingDiv>
					)}
				</CSSTransition>,
				ref,
		  )
		: null;
};

const GlobalLoadingContext = createContext({
	isGlobalLoading: GLOBAL_LOADING_DEFAULT,
	// eslint-disable-next-line
	setGlobalLoading: (isGlobalLoading: IsGlobalLoading) => {},
});

export const useGlobalLoader = () => useContext(GlobalLoadingContext);

export const GlobalLoaderProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [isGlobalLoading, setGlobalLoading] = useState(GLOBAL_LOADING_DEFAULT);

	return (
		<GlobalLoadingContext.Provider value={{ isGlobalLoading, setGlobalLoading }}>
			{children}
			<GlobalLoaderView isGlobalLoading={isGlobalLoading} />
		</GlobalLoadingContext.Provider>
	);
};

export default GlobalLoaderProvider;
