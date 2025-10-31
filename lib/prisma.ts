import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

// --- util ---
function createSlugFromTitle(title: string): string {
  return slugify(title, { lower: true, strict: true });
}

// --- client factory ---
function createPrismaClient() {
  const prisma = new PrismaClient();

  return prisma.$extends({
    query: {
      post: {
        // use a loosely typed param and safely narrow inside
        async create(params) {
          const { args, query } = params as {
            args: { data: { title?: string; slug?: string | null } };
            query: (args: unknown) => unknown;
          };

          const { title, slug } = args.data;
          if (title && !slug) {
            args.data.slug = createSlugFromTitle(title);
          }

          return query(args);
        },

        async update(params) {
          const { args, query } = params as {
            args: { data: { title?: string; slug?: string | null } };
            query: (args: unknown) => unknown;
          };

          const { title } = args.data;
          if (title) {
            args.data.slug = createSlugFromTitle(title);
          }

          return query(args);
        },
      },
    },
  });
}

// --- singleton pattern for Next.js ---
const globalForPrisma = globalThis as {
  prisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
