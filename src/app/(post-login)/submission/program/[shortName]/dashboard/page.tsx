import { pageWithPermissions } from '@/components/Page';
import Dashboard from '@/views/Submission/Dashboard/Dashboard';

const DashboardPage = ({ params: { shortName } }: { params: { shortName: string } }) => {
	const Page = pageWithPermissions(Dashboard, {
		acceptedRoles: ['isProgramAdmin', 'isDataSubmitter', 'isRDPCAdmin', 'isDCCAdmin'],
		programShortName: shortName,
	});

	return <Page shortName={shortName} />;
};

export default DashboardPage;
