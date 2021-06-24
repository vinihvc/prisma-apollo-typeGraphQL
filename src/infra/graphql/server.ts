import 'reflect-metadata'
import Container from 'typedi'
import { ApolloServer } from 'apollo-server'
import { buildSchemaSync } from 'type-graphql'
import { PrismaClient } from '@prisma/client'

import { isDevelopment } from '@config'
import { createContext } from './context'
import { customAuthChecker } from './auth-checker'

export const prisma = new PrismaClient()

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
