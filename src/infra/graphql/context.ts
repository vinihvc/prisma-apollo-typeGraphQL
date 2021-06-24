import { ExpressContext } from 'apollo-server-express/src/ApolloServer'
import { verify } from 'jsonwebtoken'

import { APP_SECRET } from '@config'
import RoleType from 'src/entities/role-types.enum'

export type ContextProps = {
  requestId: string
  userId?: number
  roles: RoleType[]
}

type TokenProps = {
  uid: number
}

export function createContext({ req }: ExpressContext): ContextProps {
  const requestId =
    Date.now().toString(36) + Math.random().toString(36).substring(2)
  const { authorization } = req.headers
  const roles: RoleType[] = []
  let userId

  if (authorization) {
    try {
      const [, jwt] = authorization.split(' ')

      const token = verify(jwt, APP_SECRET) as TokenProps

      userId = token.uid
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  return {
    userId,
    roles,
    requestId
  }
}
