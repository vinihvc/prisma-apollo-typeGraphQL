import { AuthChecker } from 'type-graphql'
import { Context } from './context'

export const customAuthChecker: AuthChecker<Context> = ({ context }, roles) => {
  if (roles.length === 0) {
    return context.userId !== undefined
  }

  if (!context.userId) {
    return false
  }

  if (context.roles.some((role) => roles.includes(role))) {
    return true
  }

  return false
}
