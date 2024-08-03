import { env } from '@/env'
import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: env.NODE_ENV === 'dev' ? ['query'] : [],
  })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

if (env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma
}

export { prisma }
