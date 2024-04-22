import { DataTableStarIcon, StatArea as StatAreaDisplay } from '@/components/Table/common';
import { Icon } from '@icgc-argo/uikit';
import pluralize from 'pluralize';
import { ComponentProps } from 'react';

const StarIcon = DataTableStarIcon;

export type RecordState = 'NEW' | 'NONE' | 'UPDATED' | 'ERROR' | 'WARNING';

type FileStat = {
	newCount: number;
	noUpdateCount: number;
	updateCount: number;
	errorCount: number;
};

export const FILE_STATE_COLORS: {
	[k in RecordState]: ComponentProps<typeof StarIcon>['fill'];
} = {
	ERROR: 'error',
	WARNING: 'warning',
	NEW: 'accent2',
	NONE: 'grey_1',
	UPDATED: 'accent3_dark',
};

const StatsArea = ({
	fileStat,
	total,
	isSubmissionValidated,
}: {
	fileStat: FileStat;
	total: number;
	isSubmissionValidated: boolean;
}) => {
	return (
		<StatAreaDisplay.Container>
			<StatAreaDisplay.Section>{total.toLocaleString()} Total</StatAreaDisplay.Section>
			<StatAreaDisplay.Section faded={!isSubmissionValidated}>
				<Icon name="chevron_right" fill="grey_1" width="8px" />
			</StatAreaDisplay.Section>
			<StatAreaDisplay.Section faded={!isSubmissionValidated}>
				<StatAreaDisplay.StatEntryContainer>
					<StatAreaDisplay.StarIcon fill={FILE_STATE_COLORS.ERROR} />
					{isSubmissionValidated && fileStat.errorCount.toLocaleString()}{' '}
					{pluralize('Error', fileStat.errorCount)}
				</StatAreaDisplay.StatEntryContainer>
			</StatAreaDisplay.Section>
			<StatAreaDisplay.Section faded={!isSubmissionValidated}>
				<StatAreaDisplay.StatEntryContainer>
					<StatAreaDisplay.StarIcon fill={FILE_STATE_COLORS.UPDATED} />
					{isSubmissionValidated && fileStat.updateCount.toLocaleString()} Updated
				</StatAreaDisplay.StatEntryContainer>
			</StatAreaDisplay.Section>
			<StatAreaDisplay.Section faded={!isSubmissionValidated}>
				<StatAreaDisplay.StatEntryContainer>
					<StatAreaDisplay.StarIcon fill={FILE_STATE_COLORS.NEW} />
					{isSubmissionValidated && fileStat.newCount.toLocaleString()} New
				</StatAreaDisplay.StatEntryContainer>
			</StatAreaDisplay.Section>
			<StatAreaDisplay.Section faded={!isSubmissionValidated}>
				<StatAreaDisplay.StatEntryContainer>
					<StatAreaDisplay.StarIcon fill={FILE_STATE_COLORS.NONE} />
					{isSubmissionValidated && fileStat.noUpdateCount.toLocaleString()} No Update
				</StatAreaDisplay.StatEntryContainer>
			</StatAreaDisplay.Section>
		</StatAreaDisplay.Container>
	);
};

export default StatsArea;
