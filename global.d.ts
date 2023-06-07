import { ARGOThemeType } from '@icgc-argo/uikit';

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NEXT_PUBLIC_TEST: string;
		}
	}
}
declare module '@emotion/react' {
	interface Theme extends ARGOThemeType {
		custom: string;
	}
}

// declare module '@icgc-argo/uikit' {
// 	interface Theme extends ARGOThemeType {
// 		custom: string;
// 	}
// }

export {};
