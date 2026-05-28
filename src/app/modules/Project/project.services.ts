import { Prisma } from "@prisma/client";
import { resolveImageUrl } from "../../../helpers/imageUrlHelpers";
import { getPagination } from "../../../helpers/paginationHelpers";
import { slugify } from "../../../helpers/slugHelpers";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

type TCreateProject = {
  title: string;
  slug?: string;
  description: string;
  shortDesc?: string;
  techStack?: string[];
  imageUrl?: string | null;
  liveUrl?: string | null;
  githubUrl?: string | null;
  featured?: boolean;
  published?: boolean;
  order?: number;
  problem?: string | null;
  approach?: string | null;
  outcome?: string | null;
  challenges?: string | null;
  role?: string | null;
  duration?: string | null;
  features?: string[];
  screenshots?: string[];
};

const listProjects = async (query: Record<string, string | undefined>) => {
  const { page, limit, skip } = getPagination(query);

  const where: Prisma.ProjectWhereInput = {};

  if (query.featured === "true") where.featured = true;
  if (query.published === "true") where.published = true;
  else if (query.published === "false") where.published = false;
  else where.published = true;

  const [data, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.project.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
};

const getProjectById = async (id: string) => {
  const project = await prisma.project.findUnique({ where: { id } });
  if (!project) throw new ApiError(404, "Project not found.");
  return project;
};

const getProjectBySlug = async (slug: string) => {
  const project = await prisma.project.findUnique({ where: { slug } });
  if (!project || !project.published) throw new ApiError(404, "Project not found.");
  return project;
};

const createProject = async (payload: TCreateProject) => {
  const slug = slugify(payload.slug || payload.title);

  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) throw new ApiError(409, "Project slug already exists.");

  const imageUrl = (await resolveImageUrl(payload.imageUrl)) ?? null;

  return prisma.project.create({
    data: {
      ...payload,
      slug,
      imageUrl,
    },
  });
};

const updateProject = async (id: string, payload: Partial<TCreateProject>) => {
  await getProjectById(id);

  const data = { ...payload };
  if (payload.slug) {
    data.slug = slugify(payload.slug);
    const duplicate = await prisma.project.findFirst({
      where: { slug: data.slug, NOT: { id } },
    });
    if (duplicate) throw new ApiError(409, "Project slug already exists.");
  }

  if (payload.imageUrl !== undefined) {
    data.imageUrl = (await resolveImageUrl(payload.imageUrl)) ?? null;
  }

  return prisma.project.update({ where: { id }, data });
};

const deleteProject = async (id: string) => {
  await getProjectById(id);
  return prisma.project.delete({ where: { id } });
};

const listAllProjects = async (query: Record<string, string | undefined>) => {
  const { page, limit, skip } = getPagination(query);
  const where: Prisma.ProjectWhereInput = {};

  if (query.featured === "true") where.featured = true;
  if (query.published === "true") where.published = true;
  if (query.published === "false") where.published = false;

  const [data, total] = await Promise.all([
    prisma.project.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.project.count({ where }),
  ]);

  return { data, meta: { page, limit, total } };
};

export const ProjectServices = {
  listProjects,
  listAllProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
};
