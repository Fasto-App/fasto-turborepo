
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: [
    {
      'http://localhost:4000/graphql': {
        headers: {
          "x-api-key": 'ab6919a9-9738-4d86-928a-ebb4734ad68a',
        },
      },
    }
  ],
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"]
    }
  },
  config: {
    contextType: "../graphql/resolvers/types#Context",
  }
};

export default config;
