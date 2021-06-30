import { PrismaClient, User } from '@prisma/client'
import { Inject, Service } from 'typedi'
import config from 'config'
import validator from 'validator'

import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { InternalError } from '@utils/errors/internal-error'
import Email from '@clients/email'
import AuthService from './auth'

export interface CreateUser {
  name: string
  email: string
  password: string
  acceptTermsAndConditions: boolean
}

export class EmailAlready extends InternalError {
  constructor() {
    super(
      'There is a unique constraint violation, a new user cannot be created with this email',
      400
    )
  }
}

export class TermsNotAccpeted extends InternalError {
  constructor() {
    super('User must accept terms!', 400)
  }
}

export class InvalidEmail extends InternalError {
  constructor() {
    super('Invalid email!', 400)
  }
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
      throw new TermsNotAccpeted()
    }

    if (!validator.isEmail(user.email)) {
      throw new InvalidEmail()
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
        // @see documentation error: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
        if (error.code === 'P2002') {
          throw new EmailAlready()
        }
      }

      throw new InternalError(error)
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
