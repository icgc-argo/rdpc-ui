import ErrorNotification, { ErrorReportColumns } from '@/app/components/ErrorNotification';
import { errorNotificationTableProps } from '@/app/components/ErrorNotification/ErrorNotificationDefaultTable';
import CLINICAL_SCHEMA_VERSION from '@/app/gql/clinical/CLINICAL_SCHEMA_VERSION';
import { useAppConfigContext } from '@/app/hooks/AppProvider';
import { useClinicalQuery } from '@/app/hooks/useApolloQuery';
import { PROGRAM_CLINICAL_SUBMISSION_PATH, PROGRAM_SHORT_NAME_PATH } from '@/global/constants';
import { ColumnDef, Link, NOTIFICATION_VARIANTS, Table, css } from '@icgc-argo/uikit';
import urljoin from 'url-join';
import { clinicalEntityDisplayNames } from '../common';

const errorColumns = [
	{
		accessorKey: 'entries',
		Header: '# Affected Records',
		id: 'entries',
		maxWidth: 135,
	},
	{
		accessorKey: 'fieldName',
		Header: `Field with Error`,
		id: 'fieldName',
		maxWidth: 215,
	},
	{
		accessorKey: 'errorMessage',
		Header: `Error Description`,
		id: 'errorMessage',
	},
];

const Subtitle = ({ program = '' }) => {
	const { DOCS_URL_ROOT } = useAppConfigContext();
	const DOCS_DICTIONARY_PAGE = urljoin(DOCS_URL_ROOT, '/dictionary/');
	const latestDictionaryResponse = useClinicalQuery(CLINICAL_SCHEMA_VERSION);

	return (
		<div
			css={css`
				margin-bottom: 12px;
			`}
		>
			<Link target="_blank" href={DOCS_DICTIONARY_PAGE}>
				{!latestDictionaryResponse.loading &&
					`Version ${latestDictionaryResponse.data.clinicalSubmissionSchemaVersion}`}
			</Link>{' '}
			of the data dictionary was released and has made some donors invalid. Please download the
			error report to view the affected donors, then submit a corrected TSV file in the{' '}
			<Link href={PROGRAM_CLINICAL_SUBMISSION_PATH.replace(PROGRAM_SHORT_NAME_PATH, program)}>
				Submit Clinical Data{' '}
			</Link>
			workspace.
		</div>
	);
};

type ErrorTableColumns = {
	entries: number;
	errorMessage: string;
	fieldName: string;
};

type ErrorTableColumnProperties = {
	accessorKey: keyof ErrorTableColumns;
	header: string;
	maxSize?: number;
};

type DefaultErrorColumns = {
	errorReportColumns: ErrorReportColumns[];
	errorTableColumns: ColumnDef<ErrorTableColumns>[];
};

const getErrorColumns = (): DefaultErrorColumns => {
	const errorTableColumns: ErrorTableColumnProperties[] = [
		{ accessorKey: 'entries', header: '# Affected Records', maxSize: 135 },
		{ accessorKey: 'fieldName', header: `Field with Error`, maxSize: 215 },
		{ accessorKey: 'errorMessage', header: `Error Description` },
	];

	const errorReportColumns: ErrorReportColumns[] = errorTableColumns.map(
		({ accessorKey, header }) => ({
			header,
			id: accessorKey,
		}),
	);

	return { errorReportColumns, errorTableColumns };
};

export type ErrorTableProps = {
	totalErrorsAmount: number;
	entityType: string;
	program: string;
	tableErrors: any;
};
export const ErrorTable = ({
	totalErrorsAmount,
	entityType,
	program,
	tableErrors,
}: ErrorTableProps) => {
	const { errorReportColumns, errorTableColumns } = getErrorColumns();

	return (
		<ErrorNotification
			level={NOTIFICATION_VARIANTS.ERROR}
			title={`${totalErrorsAmount.toLocaleString()} error(s) found on the current page of ${clinicalEntityDisplayNames[
				entityType
			].toLowerCase()} table`}
			subtitle={<Subtitle program={program} />}
			reportData={tableErrors}
			reportColumns={errorReportColumns}
			tableComponent={
				<Table {...errorNotificationTableProps} columns={errorTableColumns} data={tableErrors} />
			}
		/>
	);
};
