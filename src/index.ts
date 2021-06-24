import 'reflect-metadata'

import { ApolloServer } from 'apollo-server'

import { buildSchemaSync } from 'type-graphql'

import LoginResolver from './graphql/user'

import { createContext } from './context'

const API_PORT = 4000

const schema = buildSchemaSync({
  resolvers: [LoginResolver]
})

const server = new ApolloServer({
  schema,
  playground: true,
  context: createContext
})

server.listen({ port: API_PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${API_PORT}${server.subscriptionsPath}`
  )
)
