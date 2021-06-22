import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'

import { PrismaClient } from '@prisma/client'

import { buildSchemaSync } from 'type-graphql'

import { resolvers } from '@generated/type-graphql'

import LoginResolver from './Resolvers/login'

import { authChecker } from './Middleware/auth-checker'

const prisma = new PrismaClient({
  log: [{ emit: 'event', level: 'query' }]
})

const schema = buildSchemaSync({
  resolvers: [...resolvers, LoginResolver],
  authChecker
})

const server = new ApolloServer({
  schema,
  playground: true,
  context: () => ({ prisma })
})

server.listen({ port: 4000 }, () =>
  console.log(
    `🚀 Server ready at http://localhost:4000${server.subscriptionsPath}`
  )
)
