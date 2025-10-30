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
          const title =
            typeof args.data.title === "string"
              ? args.data.title
              : (args.data.title as any)?.set;

          if (title && !args.data.slug) {
            args.data.slug = createSlugFromTitle(title);
          }

          return query(args);
        },

        async update({ args, query }) {
          const title =
            typeof args.data.title === "string"
              ? args.data.title
              : (args.data.title as any)?.set;

          if (title) {
            args.data.slug = createSlugFromTitle(title);
          }

          return query(args);
        },
      },
    },
  })) as PrismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const db = prisma;
export default prisma;
