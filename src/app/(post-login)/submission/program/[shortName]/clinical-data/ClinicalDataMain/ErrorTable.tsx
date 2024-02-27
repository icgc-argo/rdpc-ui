import ErrorNotification from '@/app/components/ErrorNotification';
import CLINICAL_SCHEMA_VERSION from '@/app/gql/clinical/CLINICAL_SCHEMA_VERSION';
import { useAppConfigContext } from '@/app/hooks/AppProvider';
import { useClinicalQuery } from '@/app/hooks/useApolloQuery';
import { PROGRAM_CLINICAL_SUBMISSION_PATH, PROGRAM_SHORT_NAME_PATH } from '@/global/constants';
import { Link, NOTIFICATION_VARIANTS, css } from '@icgc-argo/uikit';
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
type ErrorTableProps = {
	totalErrors;
	entityType;
	program: string;
	tableErrors;
	page;
	pageSize;
	sorted;
	updatePageSettings;
};
export const ErrorTable = ({
	totalErrors,
	entityType,
	program,
	tableErrors,
	page,
	pageSize,
	sorted,
	updatePageSettings,
}: ErrorTableProps) => {
	const numErrorPages = Math.ceil(totalErrors / pageSize);
	return (
		<ErrorNotification
			level={NOTIFICATION_VARIANTS.ERROR}
			title={`${totalErrors.toLocaleString()} error(s) found on the current page of ${clinicalEntityDisplayNames[
				entityType
			].toLowerCase()} table`}
			subtitle={<Subtitle program={program} />}
			errors={tableErrors}
			columnConfig={errorColumns}
			tableProps={{
				page,
				pages: numErrorPages,
				pageSize,
				sorted,
				onPageChange: (value) => updatePageSettings('page', value),
				onPageSizeChange: (value) => updatePageSettings('pageSize', value),
				onSortedChange: (value) => updatePageSettings('sorted', value),
				// TODO: Test + Update Pagination in #2267
				// https://github.com/icgc-argo/platform-ui/issues/2267
				showPagination: false,
			}}
		/>
	);
};
