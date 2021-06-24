/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { Service } from 'typedi'

import { User } from '@generated/type-graphql'

import { ContextProps } from '../context'
import { CreateUserInput } from './models/User'
import { SignInInput } from './models/Auth'
import AuthService from '@services/auth'
import RoleType from 'src/entities/role-types.enum'

@Service()
@Resolver()
export default class UserResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async createUser(@Arg('input') input: CreateUserInput): Promise<User> {
    return this.authService.createUser(input)
  }

  @Mutation(() => String)
  async signIn(@Arg('input') input: SignInInput): Promise<string | null> {
    return this.authService.signIn(input)
  }

  @Query(() => User, { nullable: true })
  @Authorized()
  async me(@Ctx() { userId }: ContextProps): Promise<User | null> {
    return this.authService.me(userId!)
  }

  @Query(() => User, { nullable: true })
  @Authorized([RoleType.ADMIN, RoleType.MASTER])
  async info(@Ctx() { userId }: ContextProps): Promise<User | null> {
    return this.authService.me(userId!)
  }
}
