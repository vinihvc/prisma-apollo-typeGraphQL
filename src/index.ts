import { server } from './infra/graphql/server'
import { GRAPHQL_PORT } from '@config'

server.listen({ port: GRAPHQL_PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${GRAPHQL_PORT}${server.subscriptionsPath}`
  )
)
