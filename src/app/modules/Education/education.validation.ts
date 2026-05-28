import { z } from "zod";

const educationBody = z.object({
  institution: z.string().min(2),
  degree: z.string().min(2),
  field: z.string().optional(),
  description: z.string().optional(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  current: z.boolean().optional(),
  order: z.number().int().optional(),
});

const createEducation = z.object({ body: educationBody });
const updateEducation = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: educationBody.partial(),
});
const educationId = z.object({
  params: z.object({ id: z.string().uuid() }),
});

export const EducationValidation = {
  createEducation,
  updateEducation,
  educationId,
};
