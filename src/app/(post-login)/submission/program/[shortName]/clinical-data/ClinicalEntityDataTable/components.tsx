import CLINICAL_SCHEMA_VERSION from '@/app/gql/clinical/CLINICAL_SCHEMA_VERSION';
import { useAppConfigContext } from '@/app/hooks/AppProvider';
import { useClinicalQuery } from '@/app/hooks/useApolloQuery';
import { PROGRAM_CLINICAL_SUBMISSION_PATH, PROGRAM_SHORT_NAME_PATH } from '@/global/constants';
import { ContentPlaceholder, Link, css } from '@icgc-argo/uikit';
import urljoin from 'url-join';

export const NoDataCell = () => (
	<div
		css={css`
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 80px 0;
		`}
	>
		<ContentPlaceholder title="No Data Found.">
			<img alt="No Data" src="/assets/no-data.svg" />
		</ContentPlaceholder>
	</div>
);

export const DashIcon = (
	<svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M1 1H9" stroke="#BABCC2" strokeWidth="2" strokeLinecap="round" />
	</svg>
);

export const Subtitle = ({ program = '' }) => {
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
