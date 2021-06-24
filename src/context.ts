/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from '@prisma/client'

import AuthService from './services/auth'

const prisma = new PrismaClient()

export type ContextProps = {
  prisma: PrismaClient
  req: any
  authService: AuthService
}

export function createContext(req: any): ContextProps {
  return {
    ...req,
    prisma,
    authService: new AuthService(prisma)
  }
}
