import { PrismaClient } from '@prisma/client'

import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.deleteMany({})

  await prisma.user.createMany({
    data: [
      {
        email: 'vinicius@vinicius.com',
        name: 'Vinicius',
        password: await hash('123', 10)
      },

      {
        email: 'itor@itor.com',
        name: 'Itor',
        password: await hash('321', 10)
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
