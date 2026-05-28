import { z } from "zod";
import { optionalUrlField } from "../../shared/urlSchema";

const blogStatus = z.enum(["DRAFT", "PUBLISHED"]);

const createPost = z.object({
  body: z.object({
    title: z.string().min(2),
    slug: z.string().optional(),
    excerpt: z.string().min(10),
    content: z.string().optional().nullable(),
    coverUrl: optionalUrlField,
    tags: z.array(z.string()).optional(),
    readMinutes: z.number().int().positive().max(120).optional(),
    publishedAt: z
      .string()
      .datetime({ offset: true })
      .or(z.string().datetime())
      .optional(),
    status: blogStatus.optional(),
    featured: z.boolean().optional(),
    order: z.number().int().optional(),
  }),
});

const updatePost = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createPost.shape.body.partial(),
});

const postId = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const postSlug = z.object({
  params: z.object({ slug: z.string().min(1) }),
});

const listPosts = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    featured: z.enum(["true", "false"]).optional(),
    tag: z.string().optional(),
    search: z.string().optional(),
    status: blogStatus.optional(),
  }),
});

export const BlogValidation = {
  createPost,
  updatePost,
  postId,
  postSlug,
  listPosts,
};
