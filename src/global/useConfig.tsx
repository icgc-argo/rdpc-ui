import { createContext, useContext, useState } from 'react';
import { useQuery } from 'react-query';

const ConfigContext = createContext({});

export const ConfigProvider = ({ children }: { children: any }) => {
	// only need to do this once to get values from runtime api route
	const [config, setConfig] = useState({});
	useQuery('config', async () => {
		const res = await fetch('http://localhost:3000/api');
		const data = await res.json();
		console.log('use query', data);
		setConfig(data);
	});
	return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
};

export const useConfigContext = () => useContext(ConfigContext);
