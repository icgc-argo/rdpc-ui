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

import { memoize } from 'lodash';
import { clinicalEntityFields } from '../common';

export const validateEntityQueryName = (entityQuery) => {
	const entities = typeof entityQuery === 'string' ? [entityQuery] : entityQuery;
	return entities.map((entityName) => clinicalEntityFields.find((entity) => entity === entityName));
};

export const getColumnWidth = memoize<
	(keyString: string, showCompletionStats: boolean, noData: boolean) => number
>((keyString, showCompletionStats, noData) => {
	const minWidth = keyString === 'donor_id' ? 70 : showCompletionStats ? 40 : 95;
	const maxWidth = noData && showCompletionStats ? 45 : 200;
	const spacePerChar = 8;
	const margin = 10;
	const targetWidth = keyString.length * spacePerChar + margin;
	return Math.max(Math.min(maxWidth, targetWidth), minWidth);
});
