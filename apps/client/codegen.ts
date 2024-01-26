// # schema:
// #     - http://localhost:4000/graphql:
// #           headers:
// #               x-api-key: { { process.env.API_KEY } }
// # documents: './**/*.graphql'
// # generates:
// #     gen/generated.ts:
// #         plugins:
// #             - typescript
// #             - typescript-operations
// #             - typescript-react-apollo
// #         config:
// #             withHooks: true

import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: [
		{
			"http://localhost:4000/graphql": {
				headers: {
					"x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
				},
			},
		},
	],
	documents: "./**/*.graphql",
	generates: {
		"gen/generated.ts": {
			plugins: [
				"typescript",
				"typescript-operations",
				"typescript-react-apollo",
			],
		},
	},
	config: {
		withHooks: true,
	},
};

export default config;
