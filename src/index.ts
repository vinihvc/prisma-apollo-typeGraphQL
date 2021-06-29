import { server } from './infra/graphql/server'
import logger from '@logger'
import config from 'config'

const GRAPHQL_PORT = config.get('App.port')

server.listen({ port: GRAPHQL_PORT }).then(({ url, subscriptionsUrl }) => {
  logger.info(`🚀 Server ready at ${url}`)
  logger.info(`⏰ Subscriptions ready at ${subscriptionsUrl}`)
})
