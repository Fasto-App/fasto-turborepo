import { makeExecutableSchema } from '@graphql-tools/schema'
import { resolvers } from "./resolvers/GraphResolvers";
import path from 'path'
import { loadFilesSync } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'

const DIRECTORY_NAME = path.join(__dirname, './typeDefs')
const typesArray = loadFilesSync(DIRECTORY_NAME, { extensions: ['graphql'] })
const typeDefs = mergeTypeDefs(typesArray)

export const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
})