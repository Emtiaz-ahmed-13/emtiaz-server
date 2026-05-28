import { z } from "zod";
import { optionalUrlField } from "../../shared/urlSchema";

const createProject = z.object({
  body: z.object({
    title: z.string().min(2),
    slug: z.string().optional(),
    description: z.string().min(10),
    shortDesc: z.string().optional(),
    techStack: z.array(z.string()).default([]),
    imageUrl: optionalUrlField,
    liveUrl: optionalUrlField,
    githubUrl: optionalUrlField,
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
    order: z.number().int().optional(),
    problem: z.string().optional(),
    approach: z.string().optional(),
    outcome: z.string().optional(),
    challenges: z.string().optional(),
    role: z.string().optional(),
    duration: z.string().optional(),
    features: z.array(z.string()).optional(),
    screenshots: z.array(z.string()).optional(),
  }),
});

const updateProject = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createProject.shape.body.partial(),
});

const projectId = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const projectSlug = z.object({
  params: z.object({ slug: z.string().min(1) }),
});

const listProjects = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    featured: z.enum(["true", "false"]).optional(),
    published: z.enum(["true", "false"]).optional(),
  }),
});

export const ProjectValidation = {
  createProject,
  updateProject,
  projectId,
  projectSlug,
  listProjects,
};
