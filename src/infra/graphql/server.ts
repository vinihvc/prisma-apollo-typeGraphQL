import 'reflect-metadata'
import Container from 'typedi'
import { ApolloServer } from 'apollo-server'
import { buildSchemaSync } from 'type-graphql'
import prisma from '@elhprisma/client'

import { createContext } from './context'
import { customAuthChecker } from './auth-checker'

const isDevelopment = process.env.NODE_ENV !== 'production'

Container.set({ id: 'prisma', factory: () => prisma })

export const schema = buildSchemaSync({
  resolvers: [__dirname + '/resolvers/**/*.ts'],
  emitSchemaFile: true,
  authChecker: customAuthChecker,
  container: Container
})

export const server = new ApolloServer({
  schema,
  playground: isDevelopment,
  cors: true,
  context: createContext
})
