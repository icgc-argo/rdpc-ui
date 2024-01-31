'use client';

import { pageWithPermissions } from '@/components/Page';
import Register from '@/views/Submission/SampleRegistration/SampleRegistration';

const RegisterPage = ({ params: { shortName } }: { params: { shortName: string } }) => {
	const RegisterWithPermissions = pageWithPermissions(Register, {
		acceptedRoles: ['isRDPCAdmin', 'isDCCAdmin', 'isProgramAdmin', 'isDataSubmitter'],
		programShortName: shortName,
	});
	return <RegisterWithPermissions shortName={shortName} />;
};

export default RegisterPage;
