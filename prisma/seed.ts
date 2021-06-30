import { PrismaClient } from '@prisma/client'

import AuthService from '../src/services/auth'


const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany({})

  await prisma.user.createMany({
    data: [
      {
        email: 'vinicius@vinicius.com',
        name: 'Vinicius',
        password: await AuthService.hashPassword('123')
      },

      {
        email: 'itor@itor.com',
        name: 'Itor',
        password: await AuthService.hashPassword('123')
      }
    ]
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
