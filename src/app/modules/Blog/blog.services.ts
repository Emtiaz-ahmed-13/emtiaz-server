import { Prisma } from "@prisma/client";
import {
  resolveImageUrl,
  withResolvedCoverUrl,
  withResolvedCoverUrls,
} from "../../../helpers/imageUrlHelpers";
import { getPagination } from "../../../helpers/paginationHelpers";
import { slugify } from "../../../helpers/slugHelpers";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

type TCreateBlogPost = {
  title: string;
  slug?: string;
  excerpt: string;
  content?: string | null;
  coverUrl?: string | null;
  tags?: string[];
  readMinutes?: number;
  publishedAt?: string | Date;
  status?: "DRAFT" | "PUBLISHED";
  featured?: boolean;
  order?: number;
};

const buildPublicWhere = (
  query: Record<string, string | undefined>
): Prisma.BlogPostWhereInput => {
  const where: Prisma.BlogPostWhereInput = { status: "PUBLISHED" };

  if (query.featured === "true") where.featured = true;
  if (query.tag) where.tags = { has: query.tag };
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { excerpt: { contains: query.search, mode: "insensitive" } },
    ];
  }

  return where;
};

const listPublishedPosts = async (
  query: Record<string, string | undefined>
) => {
  const { page, limit, skip } = getPagination(query);
  const where = buildPublicWhere(query);

  const [data, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ featured: "desc" }, { publishedAt: "desc" }, { order: "asc" }],
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    data: await withResolvedCoverUrls(data),
    meta: { page, limit, total },
  };
};

const listAllPosts = async (
  query: Record<string, string | undefined>
) => {
  const { page, limit, skip } = getPagination(query);
  const where: Prisma.BlogPostWhereInput = {};

  if (query.status === "DRAFT" || query.status === "PUBLISHED") {
    where.status = query.status;
  }
  if (query.featured === "true") where.featured = true;
  if (query.tag) where.tags = { has: query.tag };

  const [data, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    data: await withResolvedCoverUrls(data),
    meta: { page, limit, total },
  };
};

const getPostById = async (id: string) => {
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) throw new ApiError(404, "Blog post not found.");
  return withResolvedCoverUrl(post);
};

const getPostBySlug = async (slug: string) => {
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || post.status !== "PUBLISHED") {
    throw new ApiError(404, "Blog post not found.");
  }
  return withResolvedCoverUrl(post);
};

const createPost = async (payload: TCreateBlogPost) => {
  const slug = slugify(payload.slug || payload.title);

  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) throw new ApiError(409, "Blog post slug already exists.");

  const coverUrl = (await resolveImageUrl(payload.coverUrl)) ?? null;

  const created = await prisma.blogPost.create({
    data: {
      title: payload.title,
      slug,
      excerpt: payload.excerpt,
      content: payload.content ?? null,
      coverUrl,
      tags: payload.tags ?? [],
      readMinutes: payload.readMinutes ?? 5,
      publishedAt: payload.publishedAt
        ? new Date(payload.publishedAt)
        : new Date(),
      status: payload.status ?? "PUBLISHED",
      featured: payload.featured ?? false,
      order: payload.order ?? 0,
    },
  });
  return withResolvedCoverUrl(created);
};

const updatePost = async (
  id: string,
  payload: Partial<TCreateBlogPost>
) => {
  await getPostById(id);

  const data: Prisma.BlogPostUpdateInput = {};

  if (payload.title !== undefined) data.title = payload.title;
  if (payload.excerpt !== undefined) data.excerpt = payload.excerpt;
  if (payload.content !== undefined) data.content = payload.content;
  if (payload.tags !== undefined) data.tags = payload.tags;
  if (payload.readMinutes !== undefined) data.readMinutes = payload.readMinutes;
  if (payload.status !== undefined) data.status = payload.status;
  if (payload.featured !== undefined) data.featured = payload.featured;
  if (payload.order !== undefined) data.order = payload.order;
  if (payload.publishedAt !== undefined) {
    data.publishedAt = new Date(payload.publishedAt);
  }
  if (payload.coverUrl !== undefined) {
    data.coverUrl = (await resolveImageUrl(payload.coverUrl)) ?? null;
  }
  if (payload.slug) {
    const slug = slugify(payload.slug);
    const duplicate = await prisma.blogPost.findFirst({
      where: { slug, NOT: { id } },
    });
    if (duplicate) throw new ApiError(409, "Blog post slug already exists.");
    data.slug = slug;
  }

  const updated = await prisma.blogPost.update({ where: { id }, data });
  return withResolvedCoverUrl(updated);
};

const deletePost = async (id: string) => {
  await getPostById(id);
  return prisma.blogPost.delete({ where: { id } });
};

export const BlogServices = {
  listPublishedPosts,
  listAllPosts,
  getPostById,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
};
