import { PrismaClient } from "@prisma/client"
import slugify from "slugify"

// 🔹 Utility function
function createSlugFromTitle(title: string): string {
  return slugify(title, { lower: true, strict: true })
}

// 🔹 Prisma client factory with $extends
function createPrismaClient() {
  const prisma = new PrismaClient()

  return prisma.$extends({
    query: {
      post: {
        // Let Prisma infer param types automatically
        async create({ args, query }) {
          const data = args.data as Record<string, unknown>

          const title =
            typeof data.title === "string"
              ? data.title
              : typeof (data.title as any)?.set === "string"
              ? (data.title as any).set
              : null

          if (title && !data.slug) {
            ;(data as any).slug = createSlugFromTitle(title)
          }

          return query(args)
        },

        async update({ args, query }) {
          const data = args.data as Record<string, unknown>

          const title =
            typeof data.title === "string"
              ? data.title
              : typeof (data.title as any)?.set === "string"
              ? (data.title as any).set
              : null

          if (title) {
            ;(data as any).slug = createSlugFromTitle(title)
          }

          return query(args)
        },
      },
    },
  })
}

// 🔹 Global singleton to avoid multiple Prisma instances
const globalForPrisma = globalThis as { prisma?: ReturnType<typeof createPrismaClient> }

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma
