import { PrismaClient } from '@prisma/client'
import { mockDeep, mockReset, MockProxy } from 'jest-mock-extended'

import UsersService, {
  CreateUser,
  EmailAlready,
  TermsNotAccpeted
} from '@services/users'
import Email from '@clients/email'
import prisma from '@elhprisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

jest.mock('@clients/email')

jest.mock('@elhprisma/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}))

beforeEach(() => {
  mockReset(prismaMock)
})

const prismaMock = prisma as unknown as MockProxy<PrismaClient>
const emailServiceMock = new Email() as jest.Mocked<Email>

const userMock = {
  id: '123',
  email: 'itor@gmail.com',
  name: 'Itor',
  password: '123',
  acceptTermsAndConditions: true,
  confirmedToken: '123',
  createAt: new Date(),
  updateAt: new Date(),
  confirmedAt: new Date()
}

describe('UserService', () => {
  test('should be create user and send email', async () => {
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

  test('should be validate if user accepted terms', async () => {
    const userService = new UsersService(prismaMock, emailServiceMock)

    const user: CreateUser = {
      email: 'itor@gmail.com',
      name: 'Itor',
      password: '123',
      acceptTermsAndConditions: false
    }

    expect(userService.createUser(user)).rejects.toThrowError(TermsNotAccpeted)
  })

  test('should be validate send email welcome', async () => {
    prismaMock.user.create.mockResolvedValue(userMock)

    const userService = new UsersService(prismaMock, emailServiceMock)

    const user: CreateUser = {
      email: 'itor@gmail.com',
      name: 'Itor',
      password: '123',
      acceptTermsAndConditions: true
    }

    await userService.createUser(user)

    expect(emailServiceMock.send).toBeCalledTimes(1)
  })

  test('should be validate email is unique', async () => {
    prismaMock.user.create.mockRejectedValue(
      new PrismaClientKnownRequestError('', 'P2002', '')
    )

    const userService = new UsersService(prismaMock, emailServiceMock)

    const user: CreateUser = {
      email: 'itor@gmail.com',
      name: 'Itor',
      password: '123',
      acceptTermsAndConditions: true
    }

    const action = async () => {
      await userService.createUser(user)
    }

    await expect(action).rejects.toThrowError(EmailAlready)
  })
})
