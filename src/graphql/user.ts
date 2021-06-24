import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver
} from 'type-graphql'

import { User } from '@generated/type-graphql'

import { ContextProps } from 'src/context'

@InputType()
class CreateUserInput {
  @Field()
  name: string

  @Field()
  email: string

  @Field()
  password: string
}

@InputType()
class SignInInput {
  @Field()
  email: string

  @Field()
  password: string
}

@Resolver()
export default class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg('input') input: CreateUserInput,
    @Ctx() ctx: ContextProps
  ): Promise<User> {
    return ctx.authService.createUser(input)
  }

  @Mutation(() => String)
  async signIn(
    @Arg('input') input: SignInInput,
    @Ctx() ctx: ContextProps
  ): Promise<string | null> {
    return ctx.authService.signIn(input)
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: ContextProps): Promise<User | null> {
    return ctx.authService.me(ctx)
  }
}
