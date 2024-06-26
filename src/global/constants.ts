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

export const EGO_JWT_KEY = 'EGO_JWT';
export const LOGIN_NONCE = 'LOGIN_NONCE';

export const BUILD_TIME_VARIABLES = {
	RUNTIME_CONFIG_URL:
		process.env.NEXT_PUBLIC_RUNTIME_CONFIG_URL || 'http://localhost:3000/api/config',
};

export const CONTACT_PAGE_PATH = '/contact';
export const SUBMISSION_PATH = `/submission`;
export const PROGRAM_SHORT_NAME_PATH = `[shortName]`;
export const PROGRAM_DASHBOARD_PATH = `${SUBMISSION_PATH}/program/${PROGRAM_SHORT_NAME_PATH}/dashboard`;
export const PROGRAM_SAMPLE_REGISTRATION_PATH = `${SUBMISSION_PATH}/program/${PROGRAM_SHORT_NAME_PATH}/sample-registration`;
export const PROGRAM_CLINICAL_SUBMISSION_PATH = `${SUBMISSION_PATH}/program/${PROGRAM_SHORT_NAME_PATH}/clinical-submission`;
export const PROGRAM_CLINICAL_DATA_PATH = `${SUBMISSION_PATH}/program/${PROGRAM_SHORT_NAME_PATH}/clinical-data`;
export const CREATE_PROGRAM_PAGE_PATH = `${SUBMISSION_PATH}/program/create`;

// Upload paths
export const UPLOAD_REGISTRATION = `/clinical/api/submission/program/${PROGRAM_SHORT_NAME_PATH}/registration`;
export const UPLOAD_CLINICAL_DATA = `/clinical/api/submission/program/${PROGRAM_SHORT_NAME_PATH}/clinical/submissionUpload`;

export const CLINICAL_TEMPLATE_PATH = '/clinical/proxy/template';
