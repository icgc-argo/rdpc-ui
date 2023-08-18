import { CodegenConfig } from '@graphql-codegen/cli';

const gqlConfig: CodegenConfig = {
	schema: '',
	documents: ['src/**/gql/*.tsx'],
	generates: {
		'./src/__generated__/': {
			preset: 'client',
			plugins: [],
			presetConfig: {
				gqlTagName: 'gql',
			},
		},
	},
	ignoreNoDocuments: true,
};

export default gqlConfig;
