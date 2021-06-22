import { PrismaClient } from '@prisma/client'

import { Arg, Authorized, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql'

import { User } from '@generated/type-graphql'

type Context = {
  prisma: PrismaClient
}

@InputType()
class InputCredentials implements Partial<User> {

  @Field()
  name?: string

  @Field()
  email?: string
}

@Resolver()
class LoginResolver {

  @Mutation(() => User, { nullable: true })
  @Authorized()
	async login(
    @Arg('credentials') credentials: InputCredentials, @Ctx() { prisma }: Context): Promise<User | null> {

		return await prisma.user.findFirst({
			where: credentials
		})
	}
}

export default LoginResolver
