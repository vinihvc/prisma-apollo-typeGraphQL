import { registerEnumType } from 'type-graphql'

enum RoleType {
  MASTER = 'master',
  ADMIN = 'admin',
  CUSTOMER = 'customer'
}

registerEnumType(RoleType, {
  name: 'RoleType',
  description: 'Role type for users'
})

export default RoleType
