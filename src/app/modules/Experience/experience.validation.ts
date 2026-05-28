import { z } from "zod";

const experienceBody = z.object({
  company: z.string().min(2),
  position: z.string().min(2),
  description: z.string().optional(),
  location: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  current: z.boolean().optional(),
  order: z.number().int().optional(),
});

const createExperience = z.object({ body: experienceBody });
const updateExperience = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: experienceBody.partial(),
});
const experienceId = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const ExperienceValidation = {
  createExperience,
  updateExperience,
  experienceId,
};
