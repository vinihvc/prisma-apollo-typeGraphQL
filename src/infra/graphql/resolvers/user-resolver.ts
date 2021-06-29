import { Service } from 'typedi'
import { Arg, Mutation, Resolver } from 'type-graphql'
import { User } from '@elhprisma/generated/type-graphql'

import UsersService from '@services/users'
import { CreateUserInput } from './models/User'

@Service()
@Resolver()
export default class UserResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => User)
  async signUp(@Arg('input') input: CreateUserInput): Promise<User> {
    return this.userService.createUser(input)
  }
}
