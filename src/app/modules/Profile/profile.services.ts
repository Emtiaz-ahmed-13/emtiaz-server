import ApiError from "../../errors/ApiError";
import prisma from "../../shared/prisma";

const getProfile = async () => {
  const profile = await prisma.profile.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (!profile) throw new ApiError(404, "Profile not found.");
  return profile;
};

const updateProfile = async (payload: Record<string, unknown>) => {
  const existing = await prisma.profile.findFirst();

  if (!existing) {
    throw new ApiError(
      404,
      "Profile not found. Run seed first: npm run db:seed"
    );
  }

  return prisma.profile.update({
    where: { id: existing.id },
    data: payload,
  });
};

export const ProfileServices = {
  getProfile,
  updateProfile,
};
