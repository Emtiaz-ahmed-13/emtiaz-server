import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

type TExperiencePayload = {
  company: string;
  position: string;
  description?: string;
  location?: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  current?: boolean;
  order?: number;
};

const parseDates = (payload: TExperiencePayload) => ({
  ...payload,
  startDate: new Date(payload.startDate),
  endDate: payload.endDate ? new Date(payload.endDate) : null,
});

const listExperiences = async () => {
  return prisma.experience.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
  });
};

const getExperienceById = async (id: string) => {
  const item = await prisma.experience.findUnique({ where: { id } });
  if (!item) throw new ApiError(404, "Experience not found.");
  return item;
};

const createExperience = async (payload: TExperiencePayload) => {
  return prisma.experience.create({ data: parseDates(payload) });
};

const updateExperience = async (
  id: string,
  payload: Partial<TExperiencePayload>
) => {
  await getExperienceById(id);
  const data: Record<string, unknown> = { ...payload };
  if (payload.startDate) data.startDate = new Date(payload.startDate);
  if (payload.endDate !== undefined) {
    data.endDate = payload.endDate ? new Date(payload.endDate) : null;
  }
  return prisma.experience.update({ where: { id }, data });
};

const deleteExperience = async (id: string) => {
  await getExperienceById(id);
  return prisma.experience.delete({ where: { id } });
};

export const ExperienceServices = {
  listExperiences,
  getExperienceById,
  createExperience,
  updateExperience,
  deleteExperience,
};
