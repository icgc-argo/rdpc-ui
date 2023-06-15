import { ARGOThemeType } from '@icgc-argo/uikit';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NEXT_PUBLIC_TEST: string;
		}
	}
}
declare module '@icgc-argo/uikit' {
	interface ARGOTheme {}
}

export {};
