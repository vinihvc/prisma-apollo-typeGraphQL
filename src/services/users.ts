import { PrismaClient, User } from '@prisma/client'
import { Inject, Service } from 'typedi'
import config from 'config'

import { InternalError } from '@utils/errors/internal-error'
import Email from '@clients/email'
import AuthService from './auth'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

export interface CreateUser {
  name: string
  email: string
  password: string
  acceptTermsAndConditions: boolean
}

@Service()
class UsersService {
  constructor(
    @Inject('prisma')
    private readonly prisma: PrismaClient,
    private readonly email: Email
  ) {}

  async createUser(user: CreateUser) {
    if (!user.acceptTermsAndConditions) {
      throw new InternalError('User must accept terms!', 400)
    }

    try {
      const hashedPassword = await AuthService.hashPassword(user.password)

      const newUser = await this.prisma.user.create({
        data: {
          ...user,
          password: hashedPassword
        }
      })

      await this.sendWelcomeUser(newUser)

      return newUser
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // See documentation error: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
        if (error.code === 'P2002') {
          throw new InternalError(
            'There is a unique constraint violation, a new user cannot be created with this email',
            400
          )
        }
      }

      throw new InternalError('Falied on create User', 500)
    }
  }

  private async sendWelcomeUser(user: User) {
    const host = config.get('App.hostname')
    const token = user.confirmedToken
    const subject = 'Welcome in Summer Eletro Hits'
    const html = `<h1>Welcome ${user.name}</h1> <br/> <a href="${host}/public/confirm_email?token?${token}">Confirm email</a>`
    const text = `Welcome ${user.name} \n Confirm email in link ${host}/public/confirm_email?token?${token}`

    await this.email.send(user.email, subject, html, text)
  }
}

export default UsersService
