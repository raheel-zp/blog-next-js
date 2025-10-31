import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

function createSlugFromTitle(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

const plainPrisma = new PrismaClient();

function createExtendedPrismaClient() {
  return plainPrisma.$extends({
    query: {
      post: {
        async create(params) {
          const { args, query } = params as {
            args: { data: { title?: string; slug?: string | null } };
            query: (args: unknown) => unknown;
          };
          const { title, slug } = args.data;
          if (title && !slug) args.data.slug = createSlugFromTitle(title);
          return query(args);
        },
        async update(params) {
          const { args, query } = params as {
            args: { data: { title?: string; slug?: string | null } };
            query: (args: unknown) => unknown;
          };
          const { title } = args.data;
          if (title) args.data.slug = createSlugFromTitle(title);
          return query(args);
        },
      },
    },
  });
}

const globalForPrisma = globalThis as {
  prisma?: ReturnType<typeof createExtendedPrismaClient>;
  plain?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? createExtendedPrismaClient();
export const prismaPlain = globalForPrisma.plain ?? plainPrisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.plain = prismaPlain;
}

export default prisma;
