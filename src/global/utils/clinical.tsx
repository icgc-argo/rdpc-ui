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
import { format as formatDate } from 'date-fns';

export const toDisplayRowIndex = (index: number | string) => Number(index) + 2;
export const toDisplayError = <Err extends { row: number }>(err: Err): Err => ({
	...err,
	row: toDisplayRowIndex(err.row),
});

export const formatFileName = (fileName: string): string => {
	return fileName.length > 40 ? `${fileName.substr(0, 39)}...` : fileName;
};

const dateFormat = 'yyyy-MM-dd';
export const displayDate = (date: string | Date) => {
	const jsDate = typeof date === 'string' ? new Date(date) : date;
	return formatDate(jsDate, dateFormat);
};

const dateTimeFormat = { date: 'MMMM d, yyyy', time: 'h:mm a' };
export const displayDateAndTime = (date: string | Date) => {
	if (!date) return '';
	const jsDate = typeof date === 'string' ? new Date(date) : date;
	const formattedDate = formatDate(jsDate, dateTimeFormat.date);
	const formattedTime = formatDate(jsDate, dateTimeFormat.time);
	return `${formattedDate} at ${formattedTime}`;
};

export const parseDonorIdString = (donorId: string) =>
	donorId.match(/do/i) ? parseInt(donorId.split('DO')[1]) : parseInt(donorId);
