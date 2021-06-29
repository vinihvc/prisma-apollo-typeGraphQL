import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import { v4 as uuidV4 } from 'uuid'

import AuthService, { JwtToken } from '@services/auth'
import logger from '@logger'

export type Context = {
  requestId: string
  userId?: string
  roles?: string[]
}

export function createContext({ req }: ExpressContext): Context {
  const { authorization } = req.headers
  const requestId = uuidV4()

  if (authorization) {
    try {
      const [, token] = authorization.split(' ')

      const { scopes, sub } = AuthService.decodeToken(token) as JwtToken

      return {
        userId: sub,
        roles: scopes,
        requestId
      }
    } catch (error) {
      logger.error(error, 'Falied on validate token in context graphql')

      throw new Error('Invalid token')
    }
  }

  return {
    requestId
  }
}
