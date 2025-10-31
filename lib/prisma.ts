import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createSlugFromTitle(title: string) {
  return slugify(title, { lower: true, strict: true });
}

const prisma = (globalForPrisma.prisma ??
  new PrismaClient().$extends({
    query: {
      post: {
        async create({ args, query }) {
          const data = args.data as { title?: string; slug?: string }
          if (data.title && !data.slug) {
            data.slug = createSlugFromTitle(data.title)
          }

          return query(args);
        },

        async update({ args, query }) {
          const data = args.data as { title?: string; slug?: string }
          if (data.title) {
            data.slug = createSlugFromTitle(data.title)
          }

          return query(args);
        },
      },
    },
  })) as PrismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const db = prisma;
export default prisma;
