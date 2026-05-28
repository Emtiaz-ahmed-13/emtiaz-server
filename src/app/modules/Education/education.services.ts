import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

type TEducationPayload = {
  institution: string;
  degree: string;
  field?: string;
  description?: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  current?: boolean;
  order?: number;
};

const toData = (payload: TEducationPayload) => ({
  ...payload,
  startDate: new Date(payload.startDate),
  endDate: payload.endDate ? new Date(payload.endDate) : null,
});

const listEducation = async () => {
  return prisma.education.findMany({
    orderBy: [{ order: "asc" }, { startDate: "desc" }],
  });
};

const getEducationById = async (id: string) => {
  const item = await prisma.education.findUnique({ where: { id } });
  if (!item) throw new ApiError(404, "Education not found.");
  return item;
};

const createEducation = async (payload: TEducationPayload) => {
  return prisma.education.create({ data: toData(payload) });
};

const updateEducation = async (
  id: string,
  payload: Partial<TEducationPayload>
) => {
  await getEducationById(id);
  const data: Record<string, unknown> = { ...payload };
  if (payload.startDate) data.startDate = new Date(payload.startDate);
  if (payload.endDate !== undefined) {
    data.endDate = payload.endDate ? new Date(payload.endDate) : null;
  }
  return prisma.education.update({ where: { id }, data });
};

const deleteEducation = async (id: string) => {
  await getEducationById(id);
  return prisma.education.delete({ where: { id } });
};

export const EducationServices = {
  listEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
};
