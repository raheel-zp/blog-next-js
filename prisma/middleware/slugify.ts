import slugify from 'slugify';

// Define the middleware as a function (no need for Prisma.Middleware type in v6)
export async function slugifyMiddleware(params: any, next: any) {
  if (params.model === 'Post' && (params.action === 'create' || params.action === 'update')) {
    const data = params.args.data;

    if (data?.title) {
      const baseSlug = slugify(data.title, { lower: true, strict: true });
      data.slug = baseSlug;
    }
  }

  return next(params);
}
