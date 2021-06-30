import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, MockProxy } from 'jest-mock-extended'

import UsersService, { CreateUser, EmailAlready, InvalidEmail, TermsNotAccpeted } from '@services/users'
import Email from '@clients/email'
import prisma from '@elhprisma/client'
import validator from 'validator'
import { v4 } from 'uuid'

jest.mock('@clients/email')

jest.mock('@elhprisma/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}))

beforeEach(() => {
  mockReset(prismaMock)
})

const prismaMock = prisma as MockProxy<PrismaClient>
const emailServiceMock = new Email() as jest.Mocked<Email>

const userMock = {
  id: v4(),
  email: 'itor@gmail.com',
  name: 'Itor',
  password: '123',
  acceptTermsAndConditions: true,
  confirmedToken: v4(),
  createAt: new Date(),
  updateAt: new Date(),
  confirmedAt: new Date()
}

describe('UserService', () => {
  it('should be create user and send email', async () => {
    prismaMock.user.create.mockResolvedValue(userMock)

    const userService = new UsersService(prismaMock, emailServiceMock)

    const user: CreateUser = {
      email: 'itor@gmail.com',
      name: 'Itor',
      password: '123',
      acceptTermsAndConditions: true
    }

    const newUser = await userService.createUser(user)

    expect(newUser).toEqual(userMock)
  })

  it('should be valid if user accepted terms', async () => {
    const userService = new UsersService(prismaMock, emailServiceMock)

    const user: CreateUser = {
      email: 'itor@gmail.com',
      name: 'Itor',
      password: '123',
      acceptTermsAndConditions: false
    }

    expect(userService.createUser(user)).rejects.toThrowError(TermsNotAccpeted)
  })

  it('should be called welcome email', async () => {
    const userService = new UsersService(prismaMock, emailServiceMock)

    prismaMock.user.create.mockResolvedValue(userMock)

    const user: CreateUser = {
      email: 'itor@gmail.com',
      name: 'Itor',
      password: '123',
      acceptTermsAndConditions: true
    }

    await userService.createUser(user)

    expect(emailServiceMock.send).toBeCalledTimes(1)
  })

  it('should validate email is unique', () => {

  })

  it('should check is a invalid email', () => {
    const userService = new UsersService(prismaMock, emailServiceMock)

    const user: CreateUser = {
      email: 'itor@gmail',
      name: 'Itor',
      password: '123',
      acceptTermsAndConditions: true
    }

    expect(userService.createUser(user)).rejects.toThrowError(InvalidEmail)
  })
})
