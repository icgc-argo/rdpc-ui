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
	ColumnDef,
	NOTIFICATION_VARIANTS,
	NotificationVariant,
	ReactTableCustomProps,
	Table,
} from '@icgc-argo/uikit';

export type ErrorNotificationDefaultColumns = {
	donorId: string;
	field: string;
	message: string;
	row: number;
	value: string;
};

// use these props for tables used in ErrorNotification
export const errorNotificationTableProps: ReactTableCustomProps = {
	enableColumnResizing: true,
	enableSorting: true,
	withHeaders: true,
	withRowHighlight: true,
	withStripes: true,
};

export const getDefaultErrorTableColumns = (
	level: NotificationVariant,
): {
	accessorKey: keyof ErrorNotificationDefaultColumns;
	header: string;
	maxSize?: number;
}[] => {
	const variant = level === NOTIFICATION_VARIANTS.ERROR ? 'Error' : 'Warning';
	return [
		{ accessorKey: 'row', header: 'Line #', maxSize: 70 },
		{
			accessorKey: 'donorId',
			header: 'Submitter Donor ID',
			maxSize: 160,
		},
		{
			accessorKey: 'field',
			header: `Field with ${variant}`,
			maxSize: 200,
		},
		{
			accessorKey: 'value',
			header: `${variant} Value`,
			maxSize: 130,
		},
		{
			accessorKey: 'message',
			header: `${variant} Description`,
		},
	];
};

export const getDefaultErrorReportColumns = (level: NotificationVariant) =>
	getDefaultErrorTableColumns(level).map(({ accessorKey, header }) => ({
		header,
		id: accessorKey,
	}));

const ErrorNotificationDefaultTable = ({
	data,
	level,
}: {
	data: ErrorNotificationDefaultColumns[];
	level: NotificationVariant;
}) => {
	const tableColumns: ColumnDef<ErrorNotificationDefaultColumns>[] =
		getDefaultErrorTableColumns(level);

	return <Table columns={tableColumns} data={data} {...errorNotificationTableProps} />;
};

export default ErrorNotificationDefaultTable;
