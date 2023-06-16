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

import { getAppConfig } from '@/global/config';
import * as urls from '@/global/urls';
import { Footer } from '@icgc-argo/uikit';

const { UI_VERSION } = getAppConfig();
const subtitle = `RDPC Germany Clinical Data Submission Portal - ${UI_VERSION}`;

const Logo = () => <div>RDPC</div>;

export default function GlobalFooter() {
	return (
		<Footer
			Logo={<Logo />}
			subtitle={subtitle}
			links={[
				{
					displayName: 'Contact',
					href: '/contact',
				},
				{
					displayName: 'Documentation',
					href: urls.DOCS_URL_ROOT,
					target: '_blank',
				},
				{
					displayName: 'The Team',
					href: '',
				},
				{
					displayName: 'Privacy Policy',
					href: urls.ARGO_PRIVACY_PAGE,
					target: '_blank',
				},
				{
					displayName: 'Terms & Conditions',
					href: urls.ARGO_TERMS_PAGE,
					target: '_blank',
				},
				{
					displayName: 'Publication Policy',
					href: urls.ARGO_PUBLICATION_PAGE,
					target: '_blank',
				},
			]}
		/>
	);
}
