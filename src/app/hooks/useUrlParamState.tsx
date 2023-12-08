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

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const mergeParams = (previousParams, newParams) => {
	return new URLSearchParams([...previousParams, ...newParams]).toString();
};

/**
 *
 * Initial state will be driven by URL
 * Use regular routing on component to set initial query state
 *
 * @param key
 * @param usePushNavigation
 * @returns
 */
const useUrlParamState = (key: string, usePushNavigation?: boolean) => {
	const params = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const getUrlParamState = () => params.get(key);
	const setUrlState = (value) => {
		// make a mutable copy of search params and delete the value we're replacing
		const oldParams = new URLSearchParams(params);
		oldParams.delete(key);

		const urlParams = mergeParams(oldParams.entries(), [[key, value]]);

		const newUrl = `${pathname}?${urlParams}`;

		if (usePushNavigation) {
			router.push(newUrl);
		} else {
			router.replace(newUrl);
		}
	};

	return [getUrlParamState(), setUrlState];
};

export default useUrlParamState;
