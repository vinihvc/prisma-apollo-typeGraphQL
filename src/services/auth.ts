import { PrismaClient } from '@prisma/client'

import { sign } from 'jsonwebtoken'

import { compare, hash } from 'bcryptjs'
import checkToken, { APP_SECRET } from 'src/middlewares/auth'
import { ContextProps } from 'src/context'

type SignInProps = {
  name?: string
  email: string
  password: string
}

class AuthService {
  constructor(protected prisma: PrismaClient) {}

  async createUser({ name, email, password }: SignInProps) {
    const hashedPassword = await hash(password, 10)

    return await this.prisma.user.create({
      data: {
        name: name!,
        email: email,
        password: hashedPassword
      }
    })
  }

  async signIn({ email, password }: SignInProps) {
    const user = await this.prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      throw new Error('No user found or incorrect password!')
    }

    const passwordValid = await compare(password, user.password)

    if (!passwordValid) {
      throw new Error('No user found or incorrect password!')
    }

    return sign({ userId: user.id }, APP_SECRET)
  }

  async me(ctx: ContextProps) {
    try {
      const userId = checkToken(ctx)

      const user = await this.prisma.user.findUnique({
        where: { id: Number(userId) }
      })

      return user
    } catch (err) {
      throw new Error(err)
    }
  }
}

export default AuthService
