import { z } from "zod";

const skillCategory = z.enum([
  "LANGUAGE",
  "FRAMEWORK",
  "DATABASE",
  "TOOL",
  "OTHER",
]);

const createSkill = z.object({
  body: z.object({
    name: z.string().min(1),
    category: skillCategory,
    level: z.number().int().min(1).max(100).optional(),
    order: z.number().int().optional(),
  }),
});

const updateSkill = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: createSkill.shape.body.partial(),
});

const skillId = z.object({
  params: z.object({ id: z.string().uuid() }),
});

const listSkills = z.object({
  query: z.object({
    category: skillCategory.optional(),
  }),
});

export const SkillValidation = {
  createSkill,
  updateSkill,
  skillId,
  listSkills,
};
