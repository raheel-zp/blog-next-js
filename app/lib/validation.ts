import { z } from 'zod';

export const PostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters long'),
  content: z.string().min(20, 'Content must be at least 20 characters long'),
  author: z.string().min(2, 'Author name is required'),
  categories: z.array(z.string()).optional(),
});

export type PostInput = z.infer<typeof PostSchema>;
