import { Prisma, SkillCategory } from "@prisma/client";
import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

type TCreateSkill = {
  name: string;
  category: SkillCategory;
  level?: number;
  order?: number;
};

const listSkills = async (category?: SkillCategory) => {
  const where: Prisma.SkillWhereInput = category ? { category } : {};

  return prisma.skill.findMany({
    where,
    orderBy: [{ order: "asc" }, { name: "asc" }],
  });
};

const getSkillById = async (id: string) => {
  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill) throw new ApiError(404, "Skill not found.");
  return skill;
};

const createSkill = async (payload: TCreateSkill) => {
  return prisma.skill.create({ data: payload });
};

const updateSkill = async (id: string, payload: Partial<TCreateSkill>) => {
  await getSkillById(id);
  return prisma.skill.update({ where: { id }, data: payload });
};

const deleteSkill = async (id: string) => {
  await getSkillById(id);
  return prisma.skill.delete({ where: { id } });
};

export const SkillServices = {
  listSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
