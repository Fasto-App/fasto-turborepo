import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
	overwrite: true,
	schema: [
		{
			"http://localhost:4000/graphql": {
				headers: {
					"x-api-key": process.env.API_KEY || "",
				},
			},
		},
	],
	generates: {
		"src/generated/graphql.ts": {
			plugins: ["typescript", "typescript-resolvers"],
		},
	},
	config: {
		contextType: "../graphql/resolvers/types#Context",
	},
};

export default config;
