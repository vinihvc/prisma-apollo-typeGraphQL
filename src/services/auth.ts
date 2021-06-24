import { PrismaClient } from '@prisma/client'
import { Inject, Service } from 'typedi'
import { compare, hash } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import { APP_SECRET } from '@config'

type SignInProps = {
  name?: string
  email: string
  password: string
}

@Service()
class AuthService {
  constructor(
    @Inject('prisma')
    private readonly prisma: PrismaClient
  ) {}

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

    return sign({ uid: user.id }, APP_SECRET)
  }

  async me(userId: number) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId }
      })
      return user
    } catch (err) {
      throw new Error(err)
    }
  }
}

export default AuthService
