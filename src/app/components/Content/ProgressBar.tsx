import { Progress, ProgressStatus } from '@icgc-argo/uikit';
import { FunctionComponent } from 'react';

export type ProgressState = { upload: ProgressStatus; register: ProgressStatus };

const ProgressBar: FunctionComponent<{ progressState: ProgressState }> = ({ progressState }) => {
	return (
		<Progress>
			<Progress.Item state={progressState.upload} text="Upload" />
			<Progress.Item state={progressState.register} text="Register" />
		</Progress>
	);
};

export default ProgressBar;
